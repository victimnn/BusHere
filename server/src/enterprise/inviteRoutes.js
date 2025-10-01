const express = require('express');

const { generateInviteCode } = require("./../helpers.js");

module.exports = (pool) => {
	const router = express.Router();


	// GET / - Ver convites
	router.get('/', async (req, res) => {
		try {
			const [invites] = await pool.query("SELECT * FROM ConvitesPassageiro");
			res.json({ data: invites });
		} catch (error) {
			console.error("Erro ao buscar convites:", error);
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	});

	// POST / - Criar convite
	router.post('/', async (req, res) => {
		console.log("requisição recebida:", req.body);
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: "Campo 'email' é obrigatório" });
		}
		try {
			const codigo_convite = generateInviteCode();
			const metodo_envio = "Indefinido";
			const usuario_emissor_id = req.body.usuario_emissor_id ?? 1; // Ajuste conforme autenticação
			const data_expiracao = req.body.data_expiracao ?? new Date(Date.now() + 7*24*60*60*1000); // 7 dias padrão
			const status_convite_id = req.body.status_convite_id ?? 1; // Ajuste conforme status padrão

			const convite = {
				codigo_convite,
				email_convidado: email,
				usuario_emissor_id,
				data_expiracao,
				metodo_envio,
				status_convite_id
			};

			const [insertResult] = await pool.query("INSERT INTO ConvitesPassageiro SET ?", [convite]);
			res.json({ data: { convite_passageiro_id: insertResult.insertId, ...convite } });
		} catch (error) {
			console.error("Erro ao criar convite:", error);
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	});

	// GET /:id - Ver convite
	router.get('/:id', async (req, res) => {
		const passageiroId = req.params.id;
		try {
			const [invites] = await pool.query("SELECT * FROM ConvitesPassageiro WHERE passageiro_id = ?", [passageiroId]);
			res.json({ data: invites[0] });
		} catch (error) {
			console.error("Erro ao buscar convites:", error);
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	});

	return router;
}
