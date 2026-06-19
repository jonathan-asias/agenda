/**
 * Datos oficiales de prueba Checkout Pro — Colombia (MCO).
 * @see https://www.mercadopago.com.co/developers/es/docs/checkout-pro/integration-test/test-purchases
 */
export const MERCADOPAGO_CO_TEST_CARDS = [
  {
    label: 'Mastercard (recomendada)',
    number: '5254 1336 7440 3564',
    cvv: '123',
    expiry: '11/30',
  },
  {
    label: 'Visa crédito',
    number: '4013 5406 8274 6260',
    cvv: '123',
    expiry: '11/30',
  },
  {
    label: 'Visa débito',
    number: '4915 1120 5524 6507',
    cvv: '123',
    expiry: '11/30',
  },
] as const;

export const MERCADOPAGO_CO_TEST_CARDHOLDER = {
  name: 'APRO',
  document: '123456789',
} as const;

export function getMercadoPagoSandboxUiHints() {
  const primary = MERCADOPAGO_CO_TEST_CARDS[0];
  return {
    number: primary.number,
    cvv: primary.cvv,
    expiry: primary.expiry,
    cardholder: MERCADOPAGO_CO_TEST_CARDHOLDER.name,
    document: MERCADOPAGO_CO_TEST_CARDHOLDER.document,
    alternativeCards: MERCADOPAGO_CO_TEST_CARDS.slice(1).map((c) => ({
      label: c.label,
      number: c.number,
    })),
    browserSteps: [
      'Inicie sesión en MP con el comprador de prueba (TESTUSER) en incógnito.',
      'En el checkout elija Tarjeta de crédito o débito — no use Dinero en cuenta ni la app de Mercado Pago.',
      'Ingrese la tarjeta manualmente en el formulario de MP (titular APRO, documento 123456789).',
      'Permita cookies de terceros para mercadopago.com.co y desactive extensiones en esa pestaña.',
    ],
    note:
      'Pagar con la app MP o saldo en cuenta suele fallar en sandbox. Use siempre el formulario de tarjeta con los datos de arriba. Cuenta vendedora y comprador deben ser de prueba.',
  };
}
