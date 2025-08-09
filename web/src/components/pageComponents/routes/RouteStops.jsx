import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '@web/api/api';
import LoadingSpinner from '@web/components/common/LoadingSpinner';
import ErrorAlert from '@web/components/common/ErrorAlert';

function RouteStops({ route }) {
  const [stops, setStops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRouteStops = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.routes.getStops(route.rota_id);
        
        console.log('Pontos da rota:', response);
        
        // Verificar a estrutura da resposta
        if (response?.data && Array.isArray(response.data)) {
          setStops(response.data);
        } else if (Array.isArray(response)) {
          setStops(response);
        } else {
          setStops([]);
        }
      } catch (err) {
        console.error('Erro ao buscar pontos da rota:', err);
        setError('Não foi possível carregar os pontos da rota.');
      } finally {
        setIsLoading(false);
      }
    };

    if (route?.rota_id) {
      fetchRouteStops();
    }
  }, [route]);

  if (isLoading) {
    return (
      <div className="p-3">
        <LoadingSpinner 
          size="small" 
          message="Carregando pontos da rota..." 
          variant="primary"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <ErrorAlert 
          error={error}
          onRetry={() => window.location.reload()}
          variant="warning"
        />
      </div>
    );
  }

  return (
    <div className="route-stops-container">
      <div className="card border-0">
        <div className="card-header bg-light border-0 py-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-geo-alt-fill text-primary me-2 fs-5"></i>
            <h6 className="mb-0 fw-bold text-dark">
              Pontos da Rota: {route.nome}
            </h6>
            <span className="badge bg-primary ms-2">{stops.length}</span>
          </div>
        </div>
        
        <div className="card-body p-0">
          {stops.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-geo-alt text-muted fs-1 mb-3"></i>
              <p className="text-muted mb-0">
                Nenhum ponto cadastrado para esta rota
              </p>
            </div>
          ) : (
            <div className="list-group list-group-flush" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {stops.map((stop, index) => (
                <div key={stop.ponto_id || stop.id || index} className="list-group-item border-0 py-3">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" 
                           style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}>
                        {stop.ordem || index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="mb-0 fw-semibold text-dark">
                          {stop.nome || `Ponto ${index + 1}`}
                        </h6>
                        {stop.distancia_anterior && stop.distancia_anterior > 0 && (
                          <small className="text-muted">
                            {(stop.distancia_anterior / 1000).toFixed(2)} km do anterior
                          </small>
                        )}
                      </div>
                      
                      {(stop.logradouro || stop.endereco) && (
                        <p className="mb-1 text-muted small">
                          <i className="bi bi-geo-alt me-1"></i>
                          {stop.endereco || `${stop.logradouro}${stop.numero_endereco ? `, ${stop.numero_endereco}` : ''}`}
                          {stop.bairro && ` - ${stop.bairro}`}
                          {stop.cidade && `, ${stop.cidade}`}
                          {stop.uf && ` - ${stop.uf}`}
                        </p>
                      )}
                      
                      {(stop.latitude && stop.longitude) && (
                        <p className="mb-1 text-muted small">
                          <i className="bi bi-crosshair me-1"></i>
                          {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
                        </p>
                      )}
                      
                      {stop.referencia && (
                        <p className="mb-0 text-muted small">
                          <i className="bi bi-info-circle me-1"></i>
                          {stop.referencia}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Linha conectora (exceto para o último item) */}
                  {index < stops.length - 1 && (
                    <div className="position-relative">
                      <div className="position-absolute" 
                           style={{ 
                             left: '15px', 
                             top: '8px', 
                             width: '2px', 
                             height: '20px', 
                             backgroundColor: '#dee2e6' 
                           }}>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {stops.length > 0 && (
          <div className="card-footer bg-light border-0 py-2">
            <div className="row text-center">
              <div className="col">
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {stops.length} ponto{stops.length !== 1 ? 's' : ''}
                </small>
              </div>
              {stops.some(stop => stop.distancia_anterior) && (
                <div className="col">
                  <small className="text-muted">
                    <i className="bi bi-signpost me-1"></i>
                    {(stops.reduce((total, stop) => total + (stop.distancia_anterior || 0), 0) / 1000).toFixed(2)} km total
                  </small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

RouteStops.propTypes = {
  route: PropTypes.shape({
    rota_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nome: PropTypes.string.isRequired,
  }).isRequired,
};

export default RouteStops;
