import React from "react";
import InvitePopupModal from "./InvitePopupModal";

function InviteForm() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person-plus-fill fs-2 text-primary me-3"></i>
                            <div>
                                <h2 className="mb-1">Gerenciar Convites</h2>
                                <p className="text-muted mb-0">Envie convites para novos passageiros</p>
                            </div>
                        </div>
                        <InvitePopupModal />
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <i className="bi bi-person-plus-fill fs-1 text-muted mb-3"></i>
                            <h4 className="text-muted mb-3">Gerenciamento de Convites</h4>
                            <p className="text-muted mb-4">
                                Clique no botão "Gerenciar Convites" acima para abrir o painel completo de convites.
                            </p>
                            <p className="text-muted small">
                                No painel você poderá visualizar todos os convites enviados e criar novos convites para passageiros.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InviteForm;