import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/api';
import '../../../styles/PassengerForm.scss'; // Importação do arquivo SCSS
import { createFakeBusData } from '../../fakers'; // Importa a função para gerar dados fictícios

/**
 * Componente de formulário para criação e edição de ônibus
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @returns {JSX.Element}
 */

function BusForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    placa: '',
    modelo: '',
    marca: '',
    ano_fabricacao: '',
    capacidade: '',
    status_onibus_id: ''
  });

  const [errors, setErrors] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);

  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        placa: initialData.placa || '',
        modelo: initialData.modelo || '',
        marca: initialData.marca || '',
        ano_fabricacao: initialData.ano_fabricacao || '',
        capacidade: initialData.capacidade || '',
        status_onibus_id: initialData.status_onibus_id || ''
      });
    }
  }, [initialData]);

  // Carrega os status de ônibus do banco de dados
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await api.buses.getStatus();
        if (response && response.data) {
          setStatusOptions(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar status de ônibus:', error);
        // Se não conseguir carregar, usa valores padrão
        setStatusOptions([
          { status_onibus_id: 1, nome: 'Em Operação', descricao: 'Ônibus ativo e em circulação' },
          { status_onibus_id: 2, nome: 'Em Manutenção', descricao: 'Ônibus em manutenção preventiva ou corretiva' },
          { status_onibus_id: 3, nome: 'Inativo', descricao: 'Ônibus temporariamente fora de operação' }
        ]);
      }
    };

    fetchStatusOptions();
  }, []);

  // Validação em tempo real
  const validateField = (name, value) => {
    const currentYear = new Date().getFullYear();
    
    switch(name) {
      case 'nome':
        return !value.trim() ? 'Nome do ônibus é obrigatório' : null;
      
      case 'placa':
        if (!value.trim()) return 'Placa é obrigatória';
        // Validação básica de placa (formato brasileiro)
        const placaRegex = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/;
        if (!placaRegex.test(value.toUpperCase().replace(/[^A-Z0-9]/g, ''))) {
          return 'Formato de placa inválido (ex: ABC-1234 ou ABC1D23)';
        }
        return null;
      
      case 'modelo':
        return value.trim() && value.length < 2 ? 'Modelo deve ter pelo menos 2 caracteres' : null;
      
      case 'marca':
        return value.trim() && value.length < 2 ? 'Marca deve ter pelo menos 2 caracteres' : null;
      
      case 'ano_fabricacao':
        if (value === '') return null; // Campo opcional
        const ano = parseInt(value);
        if (isNaN(ano)) return 'Ano deve ser um número';
        if (ano < 1950) return 'Ano deve ser maior que 1950';
        if (ano > currentYear + 1) return `Ano não pode ser maior que ${currentYear + 1}`;
        return null;
      
      case 'capacidade':
        if (value === '') return 'Capacidade é obrigatória';
        const capacidade = parseInt(value);
        if (isNaN(capacidade)) return 'Capacidade deve ser um número';
        if (capacidade <= 0) return 'Capacidade deve ser maior que zero';
        if (capacidade > 150) return 'Capacidade deve ser menor que 150 passageiros';
        if (capacidade < 10) return 'Capacidade deve ser pelo menos 10 passageiros';
        return null;
      
      case 'status_onibus_id':
        if (!value) return 'Status do ônibus é obrigatório';
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
    
    // Valida o campo somente se o usuário já começou a digitar algo
    if (value) {
      const errorMsg = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: errorMsg
      }));
    } else {
      // Limpa o erro quando o usuário apaga tudo
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
    <div className="card border-0">
      <form onSubmit={handleSubmit} className="card-body p-4">
        <div className="mb-4">
          <label htmlFor="nome" className="form-label fw-semibold">
            <i className="bi bi-bus-front-fill me-2 text-primary"></i>Nome do Ônibus
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-bus-front"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.nome ? 'is-invalid' : ''}`}
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Ônibus 001, Veículo Principal"
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="placa" className="form-label fw-semibold">
            <i className="bi bi-credit-card-2-front-fill me-2 text-primary"></i>Placa do Veículo
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-credit-card-2-front"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.placa ? 'is-invalid' : ''}`}
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              placeholder="ABC-1234 ou ABC1D23"
              style={{textTransform: 'uppercase'}}
            />
            {errors.placa && <div className="invalid-feedback">{errors.placa}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="marca" className="form-label fw-semibold">
            <i className="bi bi-building-fill me-2 text-primary"></i>Marca
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-building"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.marca ? 'is-invalid' : ''}`}
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ex: Mercedes-Benz, Volvo, Scania"
            />
            {errors.marca && <div className="invalid-feedback">{errors.marca}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="modelo" className="form-label fw-semibold">
            <i className="bi bi-gear-fill me-2 text-primary"></i>Modelo
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-gear"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.modelo ? 'is-invalid' : ''}`}
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ex: O500, B270F, K310"
            />
            {errors.modelo && <div className="invalid-feedback">{errors.modelo}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="ano_fabricacao" className="form-label fw-semibold">
            <i className="bi bi-calendar-event-fill me-2 text-primary"></i>Ano de Fabricação
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-calendar-event"></i>
            </span>
            <input
              type="number"
              min="1950"
              max={new Date().getFullYear() + 1}
              className={`form-control form-control-lg ${errors.ano_fabricacao ? 'is-invalid' : ''}`}
              id="ano_fabricacao"
              name="ano_fabricacao"
              value={formData.ano_fabricacao}
              onChange={handleChange}
              placeholder={`Ex: ${new Date().getFullYear()}`}
            />
            {errors.ano_fabricacao && <div className="invalid-feedback">{errors.ano_fabricacao}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="capacidade" className="form-label fw-semibold">
            <i className="bi bi-people-fill me-2 text-primary"></i>Capacidade de Passageiros
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-people"></i>
            </span>
            <input
              type="number"
              min="10"
              max="150"
              className={`form-control form-control-lg ${errors.capacidade ? 'is-invalid' : ''}`}
              id="capacidade"
              name="capacidade"
              value={formData.capacidade}
              onChange={handleChange}
              placeholder="Ex: 45, 60, 80"
            />
            {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="status_onibus_id" className="form-label fw-semibold">
            <i className="bi bi-info-circle-fill me-2 text-primary"></i>Status do Ônibus
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-info-circle"></i>
            </span>
            <select
              className={`form-control form-control-lg ${errors.status_onibus_id ? 'is-invalid' : ''}`}
              id="status_onibus_id"
              name="status_onibus_id"
              value={formData.status_onibus_id}
              onChange={handleChange}
            >
              <option value="">Selecione o status do ônibus</option>
              {statusOptions.map((status) => (
                <option key={status.status_onibus_id} value={status.status_onibus_id}>
                  {status.nome}
                </option>
              ))}
            </select>
            {errors.status_onibus_id && <div className="invalid-feedback">{errors.status_onibus_id}</div>}
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
          
          {/* botão para preencher com dados do faker.js */}
          <button
            type="button"
            className="btn btn-secondary btn-lg px-4"
            onClick={() => {
              setFormData(createFakeBusData());
              setErrors({}); // Limpa os erros ao preencher com dados fictícios
            }}
          >
            Preencher com faker
          </button>
        </div>
      </form>
    </div>
  );
}

BusForm.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    placa: PropTypes.string,
    modelo: PropTypes.string,
    marca: PropTypes.string,
    ano_fabricacao: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    capacidade: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status_onibus_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default BusForm;