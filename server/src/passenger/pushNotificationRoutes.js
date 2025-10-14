const express = require('express');

module.exports = (pool, subscriptions) => {
  const webpush = require('web-push');
  const router = express.Router();

  // Save push subscription from client
  router.post('/', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription saved.' });
  });

  // Send notification to all subscribers every 100 seconds
  setInterval(() => {
    console.log("notificações malignas:", subscriptions)
    subscriptions.forEach(sub => {
      webpush.sendNotification(sub, 'Notificação automática do servidor!')
        .catch(err => console.error('Push error:', err));
    });
  }, 100000);

  router.get('/test', (req, res) => {
    console.log("Mandando notificação para:", subscriptions)
    subscriptions.forEach(sub => {
      webpush.sendNotification(sub, 'Notificação de teste!')
        .catch(err => console.error('Push error:', err));
    });
    res.json({ message: 'Test notification sent.' });
  });

  return router;
};
