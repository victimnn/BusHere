import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../../styles/PassengerForm.scss'; // Importação do arquivo CSS

/**
 * Componente de formulário para criação e edição de passageiros
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @returns {JSX.Element}
 */
function PassengerForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: ''
  });
  
  const [errors, setErrors] = useState({});
  
  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        cpf: initialData.cpf || '',
        telefone: initialData.telefone || ''
      });
    }
  }, [initialData]);
    // Validação em tempo real
  const validateField = (name, value) => {
    switch(name) {
      case 'nome':
        return !value.trim() ? 'Nome é obrigatório' : null;
      case 'cpf':
        if (!value.trim()) return 'CPF é obrigatório';
        if (!value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) return 'CPF inválido';
        return null;
      case 'telefone':
        if (value && !value.match(/^\(\d{2}\) \d{5}-\d{4}$/)) return 'Formato: (00) 00000-0000';
        return null;
      default:
        return null;
    }
  };

  // Manipulador de alteração nos campos com validação
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Valida o campo so se o usuário já começou a digitar algo
    if (value) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    } else {
      // Limpa o erro quando o usuário apaga td
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Formatação de CPF: 000.000.000-00
  const formatCpf = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };
  
  // Formatação de telefone: (00) 00000-0000
  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };
  
  // Manipulador especial para campos formatados com validação
  const handleFormattedChange = (e, formatter) => {
    const { name, value } = e.target;
    const formattedValue = formatter(value);
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Valida o campo após formatação
    if (formattedValue) {
      const errorMsg = validateField(name, formattedValue);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validação do formulário completo
  const validateForm = () => {
    const newErrors = {};
    
    // Valida todos os campos
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
    return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-primary bg-gradient text-white">
        <h5 className="mb-0">
          <i className="bi bi-person-vcard me-2"></i>
          {initialData ? 'Editar Passageiro' : 'Novo Passageiro'}
        </h5>
      </div>
      <form onSubmit={handleSubmit} className="card-body p-4">
        <div className="mb-4">
          <label htmlFor="nome" className="form-label fw-semibold">
            <i className="bi bi-person-fill me-2 text-primary"></i>Nome
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-person"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.nome ? 'is-invalid' : ''}`}
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome completo"
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="cpf" className="form-label fw-semibold">
            <i className="bi bi-card-text me-2 text-primary"></i>CPF
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-123"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.cpf ? 'is-invalid' : ''}`}
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={(e) => handleFormattedChange(e, formatCpf)}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="telefone" className="form-label fw-semibold">
            <i className="bi bi-telephone-fill me-2 text-primary"></i>Telefone
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-telephone"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.telefone ? 'is-invalid' : ''}`}
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={(e) => handleFormattedChange(e, formatTelefone)}
              placeholder="(00) 00000-0000"
              maxLength={15}
            />
            {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="d-flex justify-content-end gap-3 mt-4">
          <button 
            type="button" 
            className="btn btn-outline-secondary btn-lg px-4" 
            onClick={onCancel}
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary text-white btn-lg px-4"
          >
            <i className={`bi ${initialData ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
            {initialData ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </div>
  );
}

PassengerForm.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    cpf: PropTypes.string,
    telefone: PropTypes.string
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default PassengerForm;
