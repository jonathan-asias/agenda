import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import { prisma } from '@/lib/prisma';
import { tenantErrorToResponse } from '@/lib/tenant';

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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createAdminClient();
    const { id } = await params;
    const institutionId = id;

    const formData = await req.formData();
    const logo = formData.get('logo') as File | null;
    const banner = formData.get('banner') as File | null;

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'instituciones';

    console.log('Uploading branding for institution:', institutionId);

    let logoUrl: string | null = null;
    let bannerUrl: string | null = null;
    let logoPath: string | null = null;
    let bannerPath: string | null = null;

    if (logo && logo.size > 0) {
      const path = `${institutionId}/logo-${Date.now()}`;
      const { error } = await supabase.storage.from(bucket).upload(path, logo, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      logoUrl = data.publicUrl;
      logoPath = path;
    }

    if (banner && banner.size > 0) {
      const path = `${institutionId}/banner-${Date.now()}`;
      const { error } = await supabase.storage.from(bucket).upload(path, banner, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      bannerUrl = data.publicUrl;
      bannerPath = path;
    }

    const institucionIdNum = Number.parseInt(institutionId, 10);
    if (!Number.isNaN(institucionIdNum)) {
      await prisma.instituciones.update({
        where: { id: institucionIdNum },
        data: {
          ...(logoPath && { logo_url: logoPath }),
          ...(bannerPath && { banner_url: bannerPath })
        }
      });
    }

    return NextResponse.json({ success: true, logoUrl, bannerUrl });
  } catch (error) {
    console.error('Branding upload error:', error);
    return NextResponse.json({ error: 'Error subiendo branding' }, { status: 500 });
  }
}
