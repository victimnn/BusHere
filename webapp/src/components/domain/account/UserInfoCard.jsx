import React from 'react';
import { formatCPF, formatPhoneNumber } from '../../../../../shared/formatters';

const UserInfoCard = ({ user }) => {
  const userFields = [
    { key: 'nome_completo', label: 'Nome Completo', colClass: 'col-12' },
    { key: 'email', label: 'Email', colClass: 'col-12' },
    { key: 'cpf', label: 'CPF', colClass: 'col-6' },
    { key: 'telefone', label: 'Telefone', colClass: 'col-6' },
    { key: 'cidade', label: 'Cidade', colClass: 'col-6' },
    { key: 'uf', label: 'UF', colClass: 'col-6' }
  ];

  // Função para formatar valores conforme o tipo de campo
  const formatFieldValue = (key, value) => {
    if (!value) return 'Não informado';
    
    switch (key) {
      case 'cpf':
        return formatCPF(value);
      case 'telefone':
        return formatPhoneNumber(value);
      default:
        return value;
    }
  };

  return (
    <div className="col-12">
      <div className="modern-card card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="mb-0 fw-bold">
              <i className="bi bi-person-badge text-primary me-2"></i>
              Informações Pessoais
            </h6>
            <span className="badge bg-primary bg-opacity-10 text-primary">
              Perfil Completo
            </span>
          </div>
          
          <div className="row g-3">
            {userFields.map((field) => (
              <div key={field.key} className={field.colClass}>
                <div className="info-field">
                  <div className="field-label">{field.label}</div>
                  <div className="field-value">
                    {formatFieldValue(field.key, user?.[field.key])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;