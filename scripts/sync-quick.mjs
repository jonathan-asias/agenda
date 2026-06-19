const BASE = 'http://localhost:3000';
const ref = process.argv[2];
const email = process.argv[3];

if (!ref || !email) {
  console.error('Uso: node scripts/sync-quick.mjs <referencia> <email>');
  process.exit(1);
}

const sync = await fetch(`${BASE}/api/payments/sync-status`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ref, email }),
}).then((r) => r.json());
console.log('sync-status:', sync);

const can = await fetch(`${BASE}/api/payments/can-register?email=${encodeURIComponent(email)}`).then(
  (r) => r.json()
);
console.log('can-register:', can);

if (can.canRegister) {
  console.log('\n✅ Registro habilitado para', email);
} else {
  console.log('\n⏳ Aún no puede registrar. Complete el pago en MP o espere el webhook.');
  process.exit(1);
}
