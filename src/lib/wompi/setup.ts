import {
  getWompiEventsSecret,
  getWompiIntegritySecret,
  getWompiPrivateKey,
  getWompiPublicKey,
  isWompiConfigured,
  isWompiSandbox,
} from '@/lib/wompi/config';

export interface WompiSetupStatus {
  configured: boolean;
  sandbox: boolean;
  missing: string[];
  warnings: string[];
  keyPrefixes: {
    public: string | null;
    private: string | null;
    integrity: string | null;
    events: string | null;
  };
}

export function getWompiSetupStatus(): WompiSetupStatus {
  const publicKey = getWompiPublicKey();
  const privateKey = getWompiPrivateKey();
  const integrity = getWompiIntegritySecret();
  const events = getWompiEventsSecret();
  const sandbox = isWompiSandbox();

  const missing: string[] = [];
  if (!publicKey) missing.push('WOMPI_PUBLIC_KEY');
  if (!privateKey) missing.push('WOMPI_PRIVATE_KEY');
  if (!integrity) missing.push('WOMPI_INTEGRITY_SECRET');

  const warnings: string[] = [];
  if (!events) {
    warnings.push(
      'WOMPI_EVENTS_SECRET no definido: el webhook no validará firma en sandbox (recomendado configurarlo).'
    );
  }

  if (publicKey && sandbox && !publicKey.startsWith('pub_test_')) {
    warnings.push('WOMPI_PUBLIC_KEY no tiene prefijo pub_test_ (¿mezcla sandbox/producción?).');
  }
  if (publicKey && !sandbox && !publicKey.startsWith('pub_prod_')) {
    warnings.push('WOMPI_PUBLIC_KEY no tiene prefijo pub_prod_ en producción.');
  }
  if (privateKey && sandbox && !privateKey.startsWith('prv_test_')) {
    warnings.push('WOMPI_PRIVATE_KEY no tiene prefijo prv_test_ (¿mezcla sandbox/producción?).');
  }
  if (privateKey && !sandbox && !privateKey.startsWith('prv_prod_')) {
    warnings.push('WOMPI_PRIVATE_KEY no tiene prefijo prv_prod_ en producción.');
  }
  if (integrity && sandbox && !integrity.includes('test_integrity')) {
    warnings.push('WOMPI_INTEGRITY_SECRET podría no ser de sandbox (esperado test_integrity_...).');
  }
  if (events && sandbox && !events.includes('test_events')) {
    warnings.push('WOMPI_EVENTS_SECRET podría no ser de sandbox (esperado test_events_...).');
  }

  return {
    configured: isWompiConfigured(),
    sandbox,
    missing,
    warnings,
    keyPrefixes: {
      public: publicKey ? publicKey.slice(0, 12) + '…' : null,
      private: privateKey ? privateKey.slice(0, 12) + '…' : null,
      integrity: integrity ? integrity.slice(0, 16) + '…' : null,
      events: events ? events.slice(0, 16) + '…' : null,
    },
  };
}
