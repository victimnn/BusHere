// Exemplo de uso dos componentes genéricos
// Este arquivo demonstra como usar os componentes DetailCard e GenericForm

import React, { useState } from 'react';

// Componentes genéricos
import DetailCard from '../detail/DetailCard';
import GenericForm from './GenericForm';

// Configurações
import { passengerConfig, busConfig, routeConfig } from '../detail/detailConfigs';
import { passengerFormConfig, busFormConfig, routeFormConfig } from '../formConfigs';

// Exemplo de página que usa os componentes genéricos
function ExamplePage() {
  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Dados de exemplo
  const examplePassenger = {
    id: 1,
    nome: 'Vitinho Bombastico',
    cpf: '123.456.789-00',
    email: 'vitinho@bomba.com',
    telefone: '(11) 99999-9999',
    tipo_passageiro: 'Estudante'
  };

  const exampleBus = {
    onibus_id: 1,
    nome: 'Giraldi 246',
    placa: 'ABC-1234',
    modelo: 'Marcopolo',
    marca: 'Mercedes-Benz',
    ano_fabricacao: 2020,
    capacidade: 42
  };

  const exampleRoute = {
    rota_id: 1,
    nome: 'Rota Floripa-ETECJB',
    codigo_rota: 'RT001',
    origem_descricao: 'Merscado 3 Irmãos',
    destino_descricao: 'ETEC Jõao Belarmino',
    distancia_km: 35.5,
    tempo_viagem_estimado_minutos: 38
  };

  // Handlers
  const handleEdit = (item, type) => {
    setIsEditing(true);
    setEditingType(type);
    
    if (type === 'passenger') {
      setSelectedPassenger(item);
    } else if (type === 'bus') {
      setSelectedBus(item);
    } else if (type === 'route') {
      setSelectedRoute(item);
    }
  };

  const handleDelete = (id, type) => {
    console.log(`Excluir ${type} com ID: ${id}`);
    // Aqui você implementaria a lógica de exclusão
  };

  const handleSubmit = (data) => {
    console.log('Dados do formulário:', data);
    // Aqui você implementaria a lógica de salvar/atualizar
    setIsEditing(false);
    setEditingType(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingType(null);
  };

  if (isEditing) {
    // Renderiza o formulário baseado no tipo
    let config;
    let initialData;

    switch (editingType) {
      case 'passenger':
        config = passengerFormConfig;
        initialData = selectedPassenger;
        break;
      case 'bus':
        config = busFormConfig;
        initialData = selectedBus;
        break;
      case 'route':
        config = routeFormConfig;
        initialData = selectedRoute;
        break;
      default:
        config = passengerFormConfig;
        initialData = null;
    }

    return (
      <div className="container-fluid py-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h4 className="mb-0">
                  {initialData ? 'Editar' : 'Criar'} {editingType === 'passenger' ? 'Passageiro' : editingType === 'bus' ? 'Ônibus' : 'Rota'}
                </h4>
              </div>
              <div className="card-body p-0">
                <GenericForm
                  config={config}
                  initialData={initialData}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <h2>Exemplo de Uso dos Componentes Genéricos</h2>
          <p className="text-muted">
            Esta página demonstra como usar os componentes DetailCard e GenericForm
            de forma genérica para diferentes entidades.
          </p>
        </div>
      </div>

      <div className="row">
        {/* Coluna de Cards de Detalhes */}
        <div className="col-lg-6">
          <h4>Componente DetailCard</h4>
          
          {/* Card de Passageiro */}
          <div className="mb-4">
            <DetailCard
              item={examplePassenger}
              onEdit={(item) => handleEdit(item, 'passenger')}
              onDelete={(id) => handleDelete(id, 'passenger')}
              config={passengerConfig}
            />
          </div>

          {/* Card de Ônibus */}
          <div className="mb-4">
            <DetailCard
              item={exampleBus}
              onEdit={(item) => handleEdit(item, 'bus')}
              onDelete={(id) => handleDelete(id, 'bus')}
              config={busConfig}
            />
          </div>

          {/* Card de Rota */}
          <div className="mb-4">
            <DetailCard
              item={exampleRoute}
              onEdit={(item) => handleEdit(item, 'route')}
              onDelete={(id) => handleDelete(id, 'route')}
              config={routeConfig}
            />
          </div>
        </div>

        {/* Coluna de Botões para Demonstrar Formulários */}
        <div className="col-lg-6">
          <h4>Componente GenericForm</h4>
          
          <div className="card">
            <div className="card-body">
              <p>Clique nos botões abaixo para testar os formulários genéricos:</p>
              
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleEdit(null, 'passenger')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Criar Novo Passageiro
                </button>
                
                <button 
                  className="btn btn-success"
                  onClick={() => handleEdit(null, 'bus')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Criar Novo Ônibus
                </button>
                
                <button 
                  className="btn btn-info"
                  onClick={() => handleEdit(null, 'route')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Criar Nova Rota
                </button>
              </div>

              <hr className="my-4" />

              <h6>Vantagens dos Componentes Genéricos:</h6>
              <ul className="list-unstyled">
                <li><i className="bi bi-check-circle text-success me-2"></i>Código reutilizável</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Layout consistente</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Fácil manutenção</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Validação automática</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Formatação de dados</li>
                <li><i className="bi bi-check-circle text-success me-2"></i>Geração de dados fictícios</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamplePage;
