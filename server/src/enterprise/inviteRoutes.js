const express = require('express');

const { generateInviteCode } = require("./../helpers.js");
const { sendInviteEmail } = require("./../services/emailService.js");

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
		console.log("📋 [inviteRoutes] Requisição POST recebida");
		console.log("📋 [inviteRoutes] Body:", req.body);
		
		const { email } = req.body;
		if (!email) {
			console.error("❌ [inviteRoutes] Email não fornecido");
			return res.status(400).json({ error: "Campo 'email' é obrigatório" });
		}
		
		console.log(`📋 [inviteRoutes] Email do convite: ${email}`);
		
		try {
			const codigo_convite = generateInviteCode();
			console.log(`📋 [inviteRoutes] Código gerado: ${codigo_convite}`);
			const metodo_envio = "Email";
			const usuario_emissor_id = req.body.usuario_emissor_id ?? 1; // Ajuste conforme autenticação
			const data_expiracao = req.body.data_expiracao ?? new Date(Date.now() + 7*24*60*60*1000); // 7 dias padrão
			let status_convite_id = req.body.status_convite_id ?? 1; // Ajuste conforme status padrão
			if(status_convite_id == 0){status_convite_id = 1} // Garantir que o status inicial não seja inválido

			const convite = {
				codigo_convite,
				email_convidado: email,
				usuario_emissor_id,
				data_expiracao,
				metodo_envio,
				status_convite_id
			};

			// Inserir convite no banco de dados
			console.log(`📋 [inviteRoutes] Inserindo convite no banco...`);
			const [insertResult] = await pool.query("INSERT INTO ConvitesPassageiro SET ?", [convite]);
			const conviteCompleto = { convite_passageiro_id: insertResult.insertId, ...convite };
			console.log(`✅ [inviteRoutes] Convite inserido com ID: ${insertResult.insertId}`);

			// ========================================================================
			// ENVIAR EMAIL COM O CONVITE (usando serviço modular)
			// ========================================================================
			let emailStatus = {
				enviado: false,
				mensagem: ''
			};

			try {
				console.log(`📧 [inviteRoutes] Iniciando envio de email para: ${email}`);
				console.log(`📧 [inviteRoutes] Código do convite: ${codigo_convite}`);
				
				const emailResult = await sendInviteEmail(email, codigo_convite);
				
				console.log(`📧 [inviteRoutes] Resultado do envio:`, emailResult);
				
				if (emailResult.success) {
					console.log(`✅ [inviteRoutes] Email enviado com sucesso para: ${email}`);
					if (emailResult.messageId) {
						console.log(`📨 [inviteRoutes] Message ID: ${emailResult.messageId}`);
					}
					emailStatus.enviado = true;
					emailStatus.mensagem = 'Email enviado com sucesso';
				} else {
					console.warn(`⚠️  [inviteRoutes] Email não foi enviado para: ${email}`);
					console.warn(`📋 [inviteRoutes] Motivo: ${emailResult.message || emailResult.error}`);
					emailStatus.enviado = false;
					emailStatus.mensagem = emailResult.message || 'Erro ao enviar email';
				}
			} catch (emailError) {
				console.error(`❌ [inviteRoutes] Erro ao enviar email:`, emailError);
				console.error(`❌ [inviteRoutes] Stack:`, emailError.stack);
				emailStatus.enviado = false;
				emailStatus.mensagem = 'Erro ao processar envio de email';
				// Não retornar erro - convite foi criado com sucesso mesmo sem email
			}

			console.log(`📋 [inviteRoutes] Retornando resposta. Status email:`, emailStatus);
			res.json({ 
				data: conviteCompleto,
				message: 'Convite criado com sucesso',
				email: emailStatus
			});
		} catch (error) {
			console.error("❌ [inviteRoutes] Erro ao criar convite:", error);
			console.error("❌ [inviteRoutes] Stack:", error.stack);
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
