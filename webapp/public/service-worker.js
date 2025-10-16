self.addEventListener('push', function(event) {
  const data = event.data ? event.data.text() : 'Nova notificação!';
  event.waitUntil(
    self.registration.showNotification('Título', {
      body: data,
      icon: '/icon-192-bg.png'
    })
  );
});
