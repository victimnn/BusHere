import React from 'react';
import { PageHeader, InfoCard, ActionButton, StatusBadge } from '../components/common';

const BillsPage = () => {
  // Dados de exemplo para boletos
  const bills = [
    {
      id: 1,
      description: 'Passagem Mensal - Dezembro 2024',
      amount: 89.90,
      dueDate: '2024-12-15',
      status: 'pending',
      billCode: '12345678901234567890'
    },
    {
      id: 2,
      description: 'Passagem Mensal - Novembro 2024',
      amount: 89.90,
      dueDate: '2024-11-15',
      status: 'paid',
      billCode: '09876543210987654321'
    },
    {
      id: 3,
      description: 'Taxa de Adesão',
      amount: 25.00,
      dueDate: '2024-10-01',
      status: 'paid',
      billCode: '11223344556677889900'
    }
  ];

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Vencido';
      default:
        return 'Desconhecido';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const totalPending = bills.filter(bill => bill.status === 'pending').reduce((sum, bill) => sum + bill.amount, 0);
  const totalPaid = bills.filter(bill => bill.status === 'paid').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingCount = bills.filter(bill => bill.status === 'pending').length;

  return (
    <div className="container-fluid p-3 page-content-with-floating-button" style={{ paddingTop: '1rem' }}>
      <div className="row">
        <div className="col-12">
          <PageHeader 
            icon="bi-credit-card" 
            title="Boletos" 
          />
          
          {/* Cards de resumo otimizados para mobile */}
          <div className="row g-2 mb-3">
            <div className="col-4">
              <div className="card bg-primary text-white border-0">
                <div className="card-body p-2 text-center">
                  <h6 className="card-title small mb-1">Pendente</h6>
                  <h6 className="mb-0">{formatCurrency(totalPending)}</h6>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card bg-success text-white border-0">
                <div className="card-body p-2 text-center">
                  <h6 className="card-title small mb-1">Pago</h6>
                  <h6 className="mb-0">{formatCurrency(totalPaid)}</h6>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="card bg-info text-white border-0">
                <div className="card-body p-2 text-center">
                  <h6 className="card-title small mb-1">Qtd</h6>
                  <h6 className="mb-0">{pendingCount}</h6>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de boletos */}
          <div className="row g-3">
            {bills.map(bill => (
              <div key={bill.id} className="col-12">
                <InfoCard shadow>
                  <div className="row g-2">
                    <div className="col-12">
                      <h6 className="fw-bold mb-1">{bill.description}</h6>
                      <small className="text-muted d-block">
                        <i className="bi bi-upc-scan me-1"></i>
                        {bill.billCode}
                      </small>
                      <small className="text-muted d-block">
                        <i className="bi bi-calendar me-1"></i>
                        Vencimento: {formatDate(bill.dueDate)}
                      </small>
                    </div>
                    
                    <div className="col-6 text-center">
                      <h6 className="mb-1 fw-bold text-primary">{formatCurrency(bill.amount)}</h6>
                      <StatusBadge 
                        status={bill.status}
                        text={getStatusText(bill.status)}
                      />
                    </div>
                    
                    <div className="col-6">
                      <div className="d-grid gap-1">
                        {bill.status === 'pending' && (
                          <ActionButton 
                            icon="bi-credit-card"
                            variant="primary"
                            size="sm"
                            fullWidth
                          >
                            Pagar
                          </ActionButton>
                        )}
                        <ActionButton 
                          icon="bi-download"
                          variant="outline-secondary"
                          size="sm"
                          fullWidth
                        />
                      </div>
                    </div>
                  </div>
                </InfoCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsPage;
