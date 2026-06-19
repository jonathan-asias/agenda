/**
 * PT-25 (P3) — Invalidación de sesión tras reset / baja.
 */
import fs from 'fs';
import path from 'path';
import { PROJECT_ROOT } from '../load-env.mjs';
import { printResults } from '../pentest-lib.mjs';

export const id = 'PT-25';
export const title = 'Invalidación tras reset / baja';
export const priority = 'P3';

function readSrc(rel) {
  return fs.readFileSync(path.join(PROJECT_ROOT, rel), 'utf8');
}

export async function run() {
  const resetSrc = readSrc('src/lib/platform-admin/reset-user-password.ts');
  const deleteSrc = readSrc('src/lib/institution/delete-institution-account.ts');

  const resetInvalidates =
    /auth\.admin\.signOut|signOut\(.*userId|invalidate.*refresh/i.test(resetSrc);
  const deleteRemovesAuth = /auth\.admin\.deleteUser/i.test(deleteSrc);

  const results = [
    {
      pass: resetInvalidates,
      label: 'Reset VORTICO invalida sesiones Supabase',
      status: resetInvalidates ? 1 : 0,
      detail: resetInvalidates
        ? 'signOut / invalidate detectado'
        : 'No hay signOut global tras updateUserById (sesión previa puede seguir activa)',
    },
    {
      pass: deleteRemovesAuth,
      label: 'Delete account elimina usuarios Auth',
      status: deleteRemovesAuth ? 1 : 0,
      detail: deleteRemovesAuth
        ? 'deleteUser en flujo de baja'
        : 'Revisar delete-institution-account.ts',
    },
  ];

  return printResults(id, title, results);
}
