const express = require('express');
const { extractToken } = require("../helpers");

module.exports = (pool) => {
	const router = express.Router();

	// GET / - Ver convites do passageiro (simples, retorna todos)
	router.get('/', async (req, res) => {
		try {
			const [invites] = await pool.query("SELECT * FROM ConvitesPassageiro");
			res.json({ data: invites });
		} catch (error) {
			console.error("Erro ao buscar convites:", error);
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	});

	// POST /accept/:id - Aceitar convite
	router.post('/accept/:id', extractToken, async (req, res) => {
		const conviteId = req.params.id;
		const token = req.token;
		try {
			// Buscar o id do passageiro pelo token
			const [tokenResult] = await pool.query("SELECT passageiro_id FROM TokensPassageiroLogin WHERE token = ?", [token]);
			const passageiroId = tokenResult[0]?.passageiro_id;
			if (!passageiroId) {
				return res.status(401).json({ error: "Token inválido ou passageiro não encontrado" });
			}
			const [updateResult] = await pool.query(
				"UPDATE ConvitesPassageiro SET passageiro_cadastrado_id = ?, data_aceite = NOW(), status_convite_id = 2 WHERE convite_passageiro_id = ?",
				[passageiroId, conviteId]
			);
			if (updateResult.affectedRows === 0) {
				return res.status(404).json({ error: "Convite não encontrado" });
			}
			res.json({ message: "Convite aceito com sucesso" });
		} catch (error) {
			console.error("Erro ao aceitar convite:", error);
			res.status(500).json({ error: "Erro interno do servidor" });
		}
	});

	return router;
}
