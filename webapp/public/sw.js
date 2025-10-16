
self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Notificação', body: event.data ? event.data.text() : 'Nova notificação!' };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notificação', {
      body: data.body || '',
      icon: '/icon-192.png',
      data: { url: data.url || '/' }
    })
  );
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    clients.openWindow(url)
  );
});
