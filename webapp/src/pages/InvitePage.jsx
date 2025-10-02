

import React from "react";
import { useState, useEffect } from "react";
import ActionButton from "../components/common/buttons/ActionButton";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";   

function InvitePage() {
	const params = useParams(); // Extrai o código do convite da URL de forma idiomática
    const navigate = useNavigate();
    const inviteCode = params.code; // Acessa o código do convite
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const meObject = await api.auth.me();
            setIsLoggedIn(!!meObject); //se retornar objeto então logged in é true
        }
        checkLoginStatus();
    }, []);



	const handleAccept = async () => {
        if (!isLoggedIn) {
            alert("Você precisa estar logado para aceitar um convite.");
            navigate("/login?redirect=/convite/" + inviteCode);
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
            navigate("/");
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
				{isLoggedIn ? "Aceitar" : "Fazer login para aceitar"}
			</ActionButton>
		</div>
	);
}

export default InvitePage;
