import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente BusCard - Exibe informações de linha de ônibus
 * Otimizado para dispositivos móveis e integrado com estrutura do banco de dados
 * 
 * Exibe dados da rota do passageiro incluindo:
 * - Informações da rota (Rotas)
 * - Ponto de embarque do passageiro (PontosRota + Pontos)
 * - Veículo e motorista da rota (VeiculoRota)
 */
const BusCard = ({ route, onClick }) => {

    const handleCardClick = () => {
        if (onClick) {
            onClick(route);
        }
    };

    return (
        <div 
            className="bg-white border-light-subtle rounded-4 p-3 mb-3 shadow-sm position-relative overflow-hidden"
            style={{ cursor: onClick ? 'pointer' : 'default' }}
            onClick={handleCardClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {/* Accent bar */}
            <div 
                className="position-absolute top-0 start-0 bg-success" 
                style={{ width: '4px', height: '100%' }}
                aria-hidden="true"
            />
            
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center flex-grow-1 me-3">
                    <div 
                        className="me-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle" 
                        style={{ width: '48px', height: '48px', minWidth: '48px' }}
                        aria-hidden="true"
                    >
                        <i className="bi bi-bus-front-fill text-success fs-5" />
                    </div>
                    <div className="flex-grow-1 min-width-0">
                        <h6 className="mb-1 fw-bold text-dark fs-6 text-truncate">
                            {route.name}
                        </h6>
                        <p 
                            className="mb-0 text-muted small lh-sm text-truncate" 
                            style={{ fontSize: '0.8rem' }}
                        >
                            {route.route}
                        </p>
                    </div>
                </div>
                
                <div className="d-flex flex-column align-items-end">
                    <div className="d-flex align-items-center mb-1">
                        <span 
                            className="fw-semibold text-dark me-2" 
                            style={{ fontSize: '1.1rem' }}
                        >
                            {route.time}
                        </span>
                    </div>

                    {route.motorista && (
                        <small className="text-muted text-end me-1" style={{ fontSize: '0.7rem' }}>
                            <i className="bi bi-person-fill me-1"></i>
                            {route.motorista}
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
};

BusCard.propTypes = {
    route: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired, // Nome do veículo (ex: "Giraldi 2246")
        route: PropTypes.string.isRequired, // Descrição da rota (origem para destino)
        time: PropTypes.string.isRequired, // Horário de passagem no ponto do passageiro
        status: PropTypes.string, // Status atual da rota
        codigo_rota: PropTypes.string, // Código da rota (ex: "R001")
        ponto_embarque: PropTypes.string, // Nome do ponto onde o passageiro embarca
        distancia_km: PropTypes.number, // Distância total da rota
        tempo_estimado: PropTypes.number, // Tempo estimado de viagem
        motorista: PropTypes.string, // Nome do motorista
        capacidade: PropTypes.number // Capacidade do veículo
    }).isRequired,
    onClick: PropTypes.func
};

BusCard.defaultProps = {
    onClick: null
};

export default BusCard;