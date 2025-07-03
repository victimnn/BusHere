import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../api/api';
import '../../../styles/PassengerForm.scss'; // Importação do arquivo SCSS
import { createFakeRouteData } from '../../utils/fakers';;

/**
 * Componente de formulário para criação e edição de rotas
 * @param {Object} props - As propriedades do componente
 * @param {Object} props.initialData - Dados iniciais para edição (opcional)
 * @param {Function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {Function} props.onCancel - Função chamada ao cancelar
 * @returns {JSX.Element}
 */

function RouteForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    codigo_rota: '',
    origem_descricao: '',
    destino_descricao: '',
    distancia_km: '',
    tempo_viagem_estimado_minutos: '',
    status_rota_id: ''
  });

  const [errors, setErrors] = useState({});
  const [statusOptions, setStatusOptions] = useState([]);

  // Carrega os dados iniciais se disponíveis (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        codigo_rota: initialData.codigo_rota || '',
        origem_descricao: initialData.origem_descricao || '',
        destino_descricao: initialData.destino_descricao || '',
        distancia_km: initialData.distancia_km || '',
        tempo_viagem_estimado_minutos: initialData.tempo_viagem_estimado_minutos || '',
        status_rota_id: initialData.status_rota_id || ''
      });
    }
  }, [initialData]);

  // Carrega os status de rota do banco de dados
  useEffect(() => {
    const fetchStatusOptions = async () => {
      try {
        const response = await api.routes.getStatus();
        if (response && response.data) {
          setStatusOptions(response.data);
        }
      } catch (error) {
        console.error('Erro ao carregar status de rotas:', error);
        // Se não conseguir carregar, usa valores padrão
        setStatusOptions([
          { status_rota_id: 1, nome: 'Ativa', descricao: 'Rota ativa e em funcionamento' },
          { status_rota_id: 2, nome: 'Inativa', descricao: 'Rota temporariamente inativa' },
          { status_rota_id: 3, nome: 'Em Planejamento', descricao: 'Rota em fase de planejamento' }
        ]);
      }
    };

    fetchStatusOptions();
  }, []);

  // Validação em tempo real
  const validateField = (name, value) => {
    switch(name) {
      case 'nome':
        return !value.trim() ? 'Nome da rota é obrigatório' : null;
      
      case 'codigo_rota':
        if (!value.trim()) return 'Código da rota é obrigatório';
        if (value.length < 3) return 'Código deve ter pelo menos 3 caracteres';
        return null;
      
      case 'origem_descricao':
        return value.trim() && value.length < 5 ? 'Descrição da origem deve ter pelo menos 5 caracteres' : null;
      
      case 'destino_descricao':
        return value.trim() && value.length < 5 ? 'Descrição do destino deve ter pelo menos 5 caracteres' : null;
      
      case 'distancia_km':
        if (value === '') return null; // Campo opcional
        const distancia = parseFloat(value);
        if (isNaN(distancia)) return 'Distância deve ser um número';
        if (distancia <= 0) return 'Distância deve ser maior que zero';
        if (distancia > 1000) return 'Distância deve ser menor que 1000 km';
        return null;
      
      case 'tempo_viagem_estimado_minutos':
        if (value === '') return null; // Campo opcional
        const tempo = parseInt(value);
        if (isNaN(tempo)) return 'Tempo deve ser um número inteiro';
        if (tempo <= 0) return 'Tempo deve ser maior que zero';
        if (tempo > 1440) return 'Tempo deve ser menor que 24 horas (1440 min)';
        return null;
      
      case 'status_rota_id':
        if (!value) return 'Status da rota é obrigatório';
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
            <i className="bi bi-signpost-split-fill me-2 text-primary"></i>Nome da Rota
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-signpost"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.nome ? 'is-invalid' : ''}`}
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Centro - Terminal Norte"
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="codigo_rota" className="form-label fw-semibold">
            <i className="bi bi-qr-code me-2 text-primary"></i>Código da Rota
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-qr-code"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.codigo_rota ? 'is-invalid' : ''}`}
              id="codigo_rota"
              name="codigo_rota"
              value={formData.codigo_rota}
              onChange={handleChange}
              placeholder="Ex: R001, LINHA-A"
            />
            {errors.codigo_rota && <div className="invalid-feedback">{errors.codigo_rota}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="origem_descricao" className="form-label fw-semibold">
            <i className="bi bi-geo-alt me-2 text-primary"></i>Ponto de Origem
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-geo-alt"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.origem_descricao ? 'is-invalid' : ''}`}
              id="origem_descricao"
              name="origem_descricao"
              value={formData.origem_descricao}
              onChange={handleChange}
              placeholder="Descrição do ponto de partida"
            />
            {errors.origem_descricao && <div className="invalid-feedback">{errors.origem_descricao}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="destino_descricao" className="form-label fw-semibold">
            <i className="bi bi-geo-alt-fill me-2 text-primary"></i>Ponto de Destino
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-geo-alt-fill"></i>
            </span>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.destino_descricao ? 'is-invalid' : ''}`}
              id="destino_descricao"
              name="destino_descricao"
              value={formData.destino_descricao}
              onChange={handleChange}
              placeholder="Descrição do ponto de chegada"
            />
            {errors.destino_descricao && <div className="invalid-feedback">{errors.destino_descricao}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="distancia_km" className="form-label fw-semibold">
            <i className="bi bi-rulers me-2 text-primary"></i>Distância (km)
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-rulers"></i>
            </span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="1000"
              className={`form-control form-control-lg ${errors.distancia_km ? 'is-invalid' : ''}`}
              id="distancia_km"
              name="distancia_km"
              value={formData.distancia_km}
              onChange={handleChange}
              placeholder="Ex: 15.5"
            />
            {errors.distancia_km && <div className="invalid-feedback">{errors.distancia_km}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="tempo_viagem_estimado_minutos" className="form-label fw-semibold">
            <i className="bi bi-clock-fill me-2 text-primary"></i>Tempo de Viagem (minutos)
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-clock"></i>
            </span>
            <input
              type="number"
              min="1"
              max="1440"
              className={`form-control form-control-lg ${errors.tempo_viagem_estimado_minutos ? 'is-invalid' : ''}`}
              id="tempo_viagem_estimado_minutos"
              name="tempo_viagem_estimado_minutos"
              value={formData.tempo_viagem_estimado_minutos}
              onChange={handleChange}
              placeholder="Ex: 45"
            />
            {errors.tempo_viagem_estimado_minutos && <div className="invalid-feedback">{errors.tempo_viagem_estimado_minutos}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="status_rota_id" className="form-label fw-semibold">
            <i className="bi bi-info-circle-fill me-2 text-primary"></i>Status da Rota
          </label>
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-info-circle"></i>
            </span>
            <select
              className={`form-control form-control-lg ${errors.status_rota_id ? 'is-invalid' : ''}`}
              id="status_rota_id"
              name="status_rota_id"
              value={formData.status_rota_id}
              onChange={handleChange}
            >
              <option value="">Selecione o status da rota</option>
              {statusOptions.map((status) => (
                <option key={status.status_rota_id} value={status.status_rota_id}>
                  {status.nome}
                </option>
              ))}
            </select>
            {errors.status_rota_id && <div className="invalid-feedback">{errors.status_rota_id}</div>}
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
              setFormData(createFakeRouteData());
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

RouteForm.propTypes = {
  initialData: PropTypes.shape({
    nome: PropTypes.string,
    codigo_rota: PropTypes.string,
    origem_descricao: PropTypes.string,
    destino_descricao: PropTypes.string,
    distancia_km: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tempo_viagem_estimado_minutos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status_rota_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default RouteForm;