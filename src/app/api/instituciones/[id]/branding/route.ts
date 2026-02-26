import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { prisma } from '@/lib/prisma';
import {
  getAuthInstitutionId,
  enforceTenant,
  tenantErrorToResponse
} from '@/lib/tenant';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);

    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    const institucion = await prisma.instituciones.findUnique({
      where: { id: institucionId },
      select: {
        logo_url: true,
        banner_url: true,
        color_primario: true,
        color_secundario: true
      }
    });

    if (!institucion) {
      return NextResponse.json({ error: 'Institución no encontrada' }, { status: 404 });
    }

    const bucket =
      process.env.SUPABASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
      'instituciones';

    const supabase = createAdminClient();
    const expiresIn = 60 * 60;

    const logoPath = institucion.logo_url;
    const bannerPath = institucion.banner_url;

    const [logoSigned, bannerSigned] = await Promise.all([
      logoPath
        ? supabase.storage.from(bucket).createSignedUrl(logoPath, expiresIn)
        : Promise.resolve({ data: null, error: null }),
      bannerPath
        ? supabase.storage.from(bucket).createSignedUrl(bannerPath, expiresIn)
        : Promise.resolve({ data: null, error: null })
    ]);

    if (logoSigned.error || bannerSigned.error) {
      return NextResponse.json(
        { error: 'No se pudieron generar los enlaces firmados' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      logoUrl: logoSigned.data?.signedUrl ?? null,
      bannerUrl: bannerSigned.data?.signedUrl ?? null,
      color_primario: institucion.color_primario,
      color_secundario: institucion.color_secundario
    });
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return response;
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error branding upload:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userInstitutionId = await getAuthInstitutionId(request);
    if (userInstitutionId == null) {
      return NextResponse.json({ error: 'Se requiere autenticación' }, { status: 401 });
    }

    const { id } = await params;
    const institucionId = Number.parseInt(id, 10);

    if (Number.isNaN(institucionId)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    enforceTenant(userInstitutionId, institucionId);

    const body = await request.json();
    const { logo_url, banner_url, color_primario, color_secundario } = body;

    const institucion = await prisma.instituciones.update({
      where: { id: institucionId },
      data: {
        logo_url: logo_url ?? null,
        banner_url: banner_url ?? null,
        color_primario: color_primario || undefined,
        color_secundario: color_secundario || undefined
      }
    });

    return NextResponse.json({ data: institucion });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error branding upload:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
