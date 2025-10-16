const express = require('express');

module.exports = (pool, subscriptions) => {
  const webpush = require('web-push');
  const router = express.Router();

  // Save push subscription from client
  // Salva inscrição de push no banco de dados
  router.post('/', async (req, res) => {
    console.log("Recebendo inscrição de push:", req.body);
    const subscription = req.body;
    // Espera-se que o id_passageiro venha no body
    const { id_passageiro, endpoint, expirationTime, keys } = subscription;
    if (!id_passageiro || !endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }
    try {
      await pool.query(
        `INSERT INTO inscricoes_notificacao_push (id_passageiro, endpoint, expirationTime, p256dh, auth) VALUES (?, ?, ?, ?, ?)`,
        [id_passageiro, endpoint, expirationTime, keys.p256dh, keys.auth]
      );
      res.status(201).json({ message: "Inscrição de push salva com sucesso." });
    } catch (error) {
      console.error("Erro ao salvar inscrição push:", error);
      res.status(500).json({ error: "Erro interno ao salvar inscrição push." });
    }
  });

  // Send notification to all subscribers every 100 seconds

  // Envia notificação automática para todas subscriptions do banco a cada 100 segundos
  setInterval(async () => {
    try {
      const [subs] = await pool.query("SELECT endpoint, expirationTime, p256dh, auth FROM inscricoes_notificacao_push");
      const subscriptionsDB = subs.map(s => ({
        endpoint: s.endpoint,
        expirationTime: s.expirationTime,
        keys: { p256dh: s.p256dh, auth: s.auth }
      }));
      console.log("notificações malignas:", subscriptionsDB);
      subscriptionsDB.forEach(sub => {
        webpush.sendNotification(sub, JSON.stringify({
          title: 'Notificação automática',
          body: 'Você recebeu uma notificação automática do servidor!',
          url: '/avisos'
        }))
        .catch(err => console.error('Push error:', err));
      });
    } catch (err) {
      console.error('Erro ao buscar subscriptions do banco:', err);
    }
  }, 100000);

  router.get('/test', async (req, res) => {
    try {
      const [subs] = await pool.query("SELECT endpoint, expirationTime, p256dh, auth FROM inscricoes_notificacao_push");
      const subscriptionsDB = subs.map(s => ({
        endpoint: s.endpoint,
        expirationTime: s.expirationTime,
        keys: { p256dh: s.p256dh, auth: s.auth }
      }));
      console.log("Mandando notificação para:", subscriptionsDB);
      subscriptionsDB.forEach(sub => {
        webpush.sendNotification(sub, JSON.stringify({
          title: 'Teste de Push',
          body: 'Esta é uma notificação de teste!',
          url: '/avisos'
        }))
        .catch(err => console.error('Push error:', err));
      });
      res.json({ message: 'Test notification sent.' });
    } catch (err) {
      console.error('Erro ao buscar subscriptions do banco:', err);
      res.status(500).json({ error: 'Erro ao buscar subscriptions do banco.' });
    }
  });

  return router;
};
