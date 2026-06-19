import fs from 'fs';

const f = 'src/app/api/docentes/[id]/route.ts';
let c = fs.readFileSync(f, 'utf8');

if (!c.includes('withTenantFromRequest')) {
  c = c.replace(
    "import { prisma } from '@/lib/prisma';\n",
    ''
  );
  c = c.replace(
    "import {\n  getAuthInstitutionId,\n  enforceTenant,\n  tenantErrorToResponse\n} from '@/lib/tenant';",
    "import {\n  enforceTenant,\n  tenantErrorToResponse\n} from '@/lib/tenant';\nimport { withTenantFromRequest } from '@/lib/db/with-tenant-request';"
  );
  c = c.replace(
    /const userInstitutionId = await getAuthInstitutionId\(request\);\s*\n\s*if \(userInstitutionId == null\) \{\s*\n\s*return NextResponse\.json\(\{ error: 'Se requiere autenticación' \}, \{ status: 401 \}\);\s*\n\s*\}\s*\n\s*\n/g,
    ''
  );
  c = c.replace(/await prisma\./g, 'await tx.');
  c = c.replace(/= prisma\./g, '= tx.');
  c = c.replace(/await prisma\.\$transaction\(async \(tx\) => \{/g, '/* inline tx */ {');
  // Fix nested transaction - replace prisma.$transaction block in DELETE
  c = c.replace(
    /const result = await \/\* inline tx \*\/ \{([\s\S]*?)return \{[\s\S]*?\};\s*\}\);/,
    'const result = await (async () => {$1return resultInner;\n    })()'
  );
  fs.writeFileSync(f, c);
  console.log('partial docentes migration - manual wrap needed');
}
