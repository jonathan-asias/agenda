/**
 * Service Worker para Web Push.
 * Registrado desde el frontend solo en navegador.
 */

self.addEventListener('push', (event) => {
  let payload = { title: 'Recordatorio', body: 'Tienes un nuevo recordatorio' };
  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text() || payload.body;
    }
  }

  const options = {
    body: payload.body || 'Tienes un nuevo recordatorio',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    tag: payload.tag || 'recordatorio',
    renotify: true,
    data: payload.data || { url: '/' },
    actions: payload.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Agenda Virtual', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
