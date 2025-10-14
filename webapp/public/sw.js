self.addEventListener('push', function(event) {
  const data = event.data ? event.data.text() : 'Nova notificação!';
  event.waitUntil(
    self.registration.showNotification('Notificação do servidor', {
      body: data,
      icon: '/icon-192.png', // Adapte para o seu ícone
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
