#!/usr/bin/env node
/**
 * Script temporal para generar VAPID keys para Web Push.
 * Ejecutar: node scripts/generate-vapid-keys.mjs
 *
 * Guardar las claves en .env:
 * WEB_PUSH_PUBLIC_KEY=...
 * WEB_PUSH_PRIVATE_KEY=...
 */

import webpush from 'web-push';

const vapidKeys = webpush.generateVAPIDKeys();
console.log('\n=== VAPID Keys ===\n');
console.log('WEB_PUSH_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('WEB_PUSH_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('\nAgregar estas líneas a tu archivo .env\n');
