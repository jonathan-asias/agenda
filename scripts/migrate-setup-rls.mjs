import fs from 'fs';

const files = [
  'src/app/api/setup/docentes/route.ts',
  'src/app/api/setup/areas-materias/route.ts',
  'src/app/api/setup/materia-grados/route.ts',
  'src/app/api/setup/materias/route.ts',
  'src/app/api/setup/grados-cursos/route.ts',
];

for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('withAdminTenantDb(request')) {
    console.log('skip (already migrated):', f);
    continue;
  }

  c = c.replace(/import \{ prisma \} from '@\/lib\/prisma';\r?\n/, '');
  c = c.replace(
    "import { requireAdminApiInstitutionId } from '@/lib/security/require-admin-api';",
    "import { withAdminTenantDb } from '@/lib/security/require-admin-api';"
  );
  c = c.replace(
    /\s*const userInstitutionId = await requireAdminApiInstitutionId\(request\);\r?\n\s*\n/,
    '\n'
  );
  c = c.replace(/await prisma\./g, 'await tx.');
  c = c.replace(/= prisma\./g, '= tx.');
  c = c.replace(/\(prisma\./g, '(tx.');

  const idx = c.search(/const institucion = await tx\.instituciones\.findUnique/);
  if (idx === -1) {
    console.log('warn: no institucion lookup in', f);
    fs.writeFileSync(f, c);
    continue;
  }

  const before = c.slice(0, idx);
  const after = c.slice(idx);
  const lastReturn = after.lastIndexOf('return NextResponse.json');
  if (lastReturn === -1) {
    console.log('warn: no return in', f);
    fs.writeFileSync(f, c);
    continue;
  }

  const middle = after.slice(0, lastReturn);
  let retBlock = after.slice(lastReturn);
  retBlock = retBlock.replace(
    /\}\);\s*\n\s*\} catch \(error\)/,
    '    });\n    });\n\n  } catch (error)'
  );

  c = `${before}    return await withAdminTenantDb(request, async (tx, userInstitutionId) => {\n${middle}${retBlock}`;
  fs.writeFileSync(f, c);
  console.log('updated:', f);
}
