

import React from "react";
import ActionButton from "../components/common/buttons/ActionButton";
import { useParams } from "react-router-dom";
import api from "../api/api";   

function InvitePage() {
	const params = useParams(); // Extrai o código do convite da URL de forma idiomática
    const inviteCode = params.code; // Acessa o código do convite




	const handleAccept = async () => {
        // Verificar se esta com login
        const meObject = await api.auth.me();
        if (!meObject) {
            alert("Você precisa estar logado para aceitar um convite.");
            return;
        }

        // Verificar se o convite existe
        const invite = await api.invites.getByCode(inviteCode)
        if (!invite) {
            alert("Convite inválido.");
            return;
        }   

        // Aceitar o convite
        const result = await api.invites.accept(inviteCode);
        console.log(result);
        if (result) {
            alert("Convite aceito com sucesso!");
        } else {
            alert("Erro ao aceitar o convite.");
        }


    };
	return (
		<div className="d-flex flex-column align-items-center vh-100">
			<div className="text-center mb-4" style={{ fontSize: 48, marginTop: 80 }}>
				Você está recebendo um convite
			</div>
            <div className="text-center mb-4" style={{ fontSize: 24, maxWidth: 400 }}>
                Código do convite: <pre>{inviteCode}</pre>
            </div>

			<div style={{ height: 32 }} />
			<ActionButton
				variant="outline-primary"
				size="lg"
				style={{ minWidth: "80%", borderRadius: 15, marginTop: "auto", marginBottom: 160 }}
				onClick={handleAccept}
			>
				Aceitar
			</ActionButton>
		</div>
	);
}

export default InvitePage;
