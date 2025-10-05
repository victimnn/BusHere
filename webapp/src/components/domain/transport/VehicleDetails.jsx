import React from 'react';
import PropTypes from 'prop-types';

const VehicleDetails = ({ vehicle, driver }) => {
    if (!vehicle) {
        return (
            <div className="vehicle-details-card">
                <div className="card border-0 shadow-sm">
                    <div className="card-body p-3">
                        <h6 className="mb-3 fw-bold">
                            <i className="bi bi-bus-front text-primary me-2"></i>
                            Detalhes do Veículo
                        </h6>
                        <div className="empty-state text-center py-3">
                            <i className="bi bi-exclamation-circle text-muted fs-4"></i>
                            <p className="text-muted small mb-0 mt-2">Informações não disponíveis</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="vehicle-details-card">
            <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                    <h6 className="mb-2 fw-bold">
                        <i className="bi bi-bus-front text-primary me-2"></i>
                        Detalhes do Veículo
                    </h6>
                    
                    <div className="row g-2">
                        <div className="col-6">
                            <div className="info-field">
                                <div className="field-label">Placa</div>
                                <div className="field-value">{vehicle.placa || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="info-field">
                                <div className="field-label">Modelo</div>
                                <div className="field-value">{vehicle.modelo || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="info-field">
                                <div className="field-label">Ano</div>
                                <div className="field-value">{vehicle.ano || 'N/A'}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="info-field">
                                <div className="field-label">Capacidade</div>
                                <div className="field-value">
                                    {vehicle.capacidade ? `${vehicle.capacidade} lugares` : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {driver && (
                        <div className="mt-2 pt-2 border-top">
                            <h6 className="mb-2 fw-semibold small">
                                <i className="bi bi-person-circle text-success me-1"></i>
                                Motorista
                            </h6>
                            <div className="d-flex align-items-center">
                                <div className="driver-avatar me-2">
                                    <i className="bi bi-person-circle fs-5 text-muted"></i>
                                </div>
                                <div>
                                    <div className="fw-semibold small">{driver.nome || driver.motorista_nome || 'N/A'}</div>
                                    <div className="text-muted small">
                                        <i className="bi bi-star-fill text-warning me-1"></i>
                                        {driver.experiencia || 'Experiente'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

VehicleDetails.propTypes = {
    vehicle: PropTypes.object,
    driver: PropTypes.object
};

VehicleDetails.defaultProps = {
    vehicle: null,
    driver: null
};

export default VehicleDetails;
