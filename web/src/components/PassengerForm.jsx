import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

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
  
  // Manipulador de alteração nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
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
  
  // Manipulador especial para campos formatados
  const handleFormattedChange = (e, formatter) => {
    const { name, value } = e.target;
    const formattedValue = formatter(value);
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!formData.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
      newErrors.cpf = 'CPF inválido (formato: 000.000.000-00)';
    }
    
    if (formData.telefone && !formData.telefone.match(/^\(\d{2}\) \d{5}-\d{4}$/)) {
      newErrors.telefone = 'Telefone inválido (formato: (00) 00000-0000)';
    }
    
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
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label htmlFor="nome" className="form-label">Nome</label>
        <input
          type="text"
          className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Nome completo"
        />
        {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="cpf" className="form-label">CPF</label>
        <input
          type="text"
          className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
          id="cpf"
          name="cpf"
          value={formData.cpf}
          onChange={(e) => handleFormattedChange(e, formatCpf)}
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
      </div>
      
      <div className="mb-3">
        <label htmlFor="telefone" className="form-label">Telefone</label>
        <input
          type="text"
          className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={(e) => handleFormattedChange(e, formatTelefone)}
          placeholder="(00) 00000-0000"
          maxLength={15}
        />
        {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
      </div>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
        >
          {initialData ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
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
