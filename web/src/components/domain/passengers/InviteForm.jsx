import {useState, useEffect} from "react";
import ActionButton from "@web/components/common/buttons/ActionButton"
import api from "@web/api/api";

const STATUS_CONVITE = [
    "Pendente",
    "Aceito",
    "Expirado",
    "Recusado",
]


function InvitesTable({ invites }) {
    return (
        <table className="table table-group-divider table-striped table-border">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Email</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {invites.map((invite) => (
                    <tr key={invite.convite_passageiro_id} onClick={() => {navigator.clipboard.writeText("localhost:5174/convite/" + invite.codigo_convite); alert("Código copiado para a área de transferência!")}}>
                        <td>{invite.codigo_convite.substring(0, 8)}...</td>
                        <td>{invite.email_convidado}</td>
                        <td>{STATUS_CONVITE[invite.status_convite_id]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

function InviteForm() {
    const [invites, setInvites] = useState([]);
    const [email, setEmail] = useState("");
    const fetchInvites = async () => {
        try {
            const response = await api.invites.list();
            setInvites(response.data);
            console.log("convites",response.data);
        } catch (error) {
            console.error("Erro ao buscar convites:", error);
        }
    };

    useEffect(() => {
        fetchInvites();
    }, []);


    const handleInvite = async () => {
        const newInvite = { id: Date.now(), email: email, status_convite_id: 0 };
        console.log("newInvite", newInvite);
        setEmail("");

        const response = await api.invites.create(newInvite);
        fetchInvites();
    };

    return (
        <div>
            <h4> Convites pendentes </h4>

            <InvitesTable invites={invites} />

            <div className="border p-3">
                <h4>Criar Novo Convite</h4>
                <input
                    type="email"
                    placeholder="Email do convidado"
                    className="form-control mb-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <ActionButton text="Enviar Convite" onClick={handleInvite} />
            </div>
        </div>
    )
}

export default InviteForm;