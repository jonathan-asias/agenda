import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-admin';
import {
  enforceTenant,
  tenantErrorToResponse,
  getAuthInstitutionId,
} from '@/lib/tenant';
import {
  authorizeBrandingWrite,
  validateBrandingFileContent,
  resolveBrandingContentType,
} from '@/lib/security/branding-upload';
import { validateBrandingColor } from '@/lib/security/branding-colors';
import { withDbBypass } from '@/lib/db/rls-context';
import { withTenantFromRequest } from '@/lib/db/with-tenant-request';

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

    return await withTenantFromRequest(request, async (tx, userInstitutionId) => {
      enforceTenant(userInstitutionId, institucionId);

      const institucion = await tx.instituciones.findUnique({
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
    });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Error branding GET:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const institucionIdNum = Number.parseInt(id, 10);

    if (Number.isNaN(institucionIdNum)) {
      return NextResponse.json({ error: 'ID de institución inválido' }, { status: 400 });
    }

    const contentType = req.headers.get('content-type') ?? '';

    if (contentType.includes('application/json')) {
      return await withTenantFromRequest(req, async (tx, userInstitutionId) => {
        enforceTenant(userInstitutionId, institucionIdNum);

        const body = (await req.json()) as {
          logo_url?: string;
          banner_url?: string;
          color_primario?: string;
          color_secundario?: string;
        };

        const colorUpdates: { color_primario?: string; color_secundario?: string } = {};
        if (body.color_primario != null) {
          const validated = validateBrandingColor(body.color_primario);
          if (!validated.ok) {
            return NextResponse.json({ error: validated.error }, { status: 400 });
          }
          colorUpdates.color_primario = validated.value;
        }
        if (body.color_secundario != null) {
          const validated = validateBrandingColor(body.color_secundario);
          if (!validated.ok) {
            return NextResponse.json({ error: validated.error }, { status: 400 });
          }
          colorUpdates.color_secundario = validated.value;
        }

        await tx.instituciones.update({
          where: { id: institucionIdNum },
          data: {
            ...(body.logo_url != null ? { logo_url: body.logo_url } : {}),
            ...(body.banner_url != null ? { banner_url: body.banner_url } : {}),
            ...colorUpdates,
          },
        });

        return NextResponse.json({ success: true });
      });
    }

    const formData = await req.formData();
    const bootstrapEmail = formData.get('bootstrapEmail');
    const bootstrapEmailStr =
      typeof bootstrapEmail === 'string' ? bootstrapEmail : null;

    const authResult = await authorizeBrandingWrite(
      req,
      institucionIdNum,
      bootstrapEmailStr
    );
    if (!authResult.ok) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const logo = formData.get('logo');
    const banner = formData.get('banner');
    const logoFile = logo instanceof File ? logo : null;
    const bannerFile = banner instanceof File ? banner : null;

    if (logoFile && logoFile.size > 0) {
      const err = await validateBrandingFileContent(logoFile, 'Logo');
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }
    if (bannerFile && bannerFile.size > 0) {
      const err = await validateBrandingFileContent(bannerFile, 'Banner');
      if (err) {
        return NextResponse.json({ error: err }, { status: 400 });
      }
    }

    if (
      (!logoFile || logoFile.size === 0) &&
      (!bannerFile || bannerFile.size === 0)
    ) {
      return NextResponse.json(
        { error: 'Debe enviar al menos un archivo logo o banner' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'instituciones';
    const institutionId = String(institucionIdNum);

    let logoUrl: string | null = null;
    let bannerUrl: string | null = null;
    let logoPath: string | null = null;
    let bannerPath: string | null = null;

    if (logoFile && logoFile.size > 0) {
      const path = `${institutionId}/logo-${Date.now()}`;
      const header = new Uint8Array(await logoFile.slice(0, 16).arrayBuffer());
      const { error } = await supabase.storage.from(bucket).upload(path, logoFile, {
        upsert: true,
        contentType: resolveBrandingContentType(logoFile, header),
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      logoUrl = data.publicUrl;
      logoPath = path;
    }

    if (bannerFile && bannerFile.size > 0) {
      const path = `${institutionId}/banner-${Date.now()}`;
      const header = new Uint8Array(await bannerFile.slice(0, 16).arrayBuffer());
      const { error } = await supabase.storage.from(bucket).upload(path, bannerFile, {
        upsert: true,
        contentType: resolveBrandingContentType(bannerFile, header),
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      bannerUrl = data.publicUrl;
      bannerPath = path;
    }

    const updateData = {
      ...(logoPath && { logo_url: logoPath }),
      ...(bannerPath && { banner_url: bannerPath }),
    };

    const userInstitutionId = await getAuthInstitutionId(req);
    if (userInstitutionId != null) {
      return await withTenantFromRequest(req, async (tx, sessionInstitutionId) => {
        enforceTenant(sessionInstitutionId, institucionIdNum);

        await tx.instituciones.update({
          where: { id: institucionIdNum },
          data: updateData,
        });

        return NextResponse.json({ success: true, logoUrl, bannerUrl });
      });
    }

    // Post-registro: authorizeBrandingWrite ya validó email + ventana temporal
    await withDbBypass(async (tx) => {
      await tx.instituciones.update({
        where: { id: institucionIdNum },
        data: updateData,
      });
    });

    return NextResponse.json({ success: true, logoUrl, bannerUrl });
  } catch (error) {
    const tenantResp = tenantErrorToResponse(error);
    if (tenantResp) return tenantResp;
    console.error('Branding upload error:', error);
    return NextResponse.json({ error: 'Error subiendo branding' }, { status: 500 });
  }
}
