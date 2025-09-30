import React from 'react';
import PropTypes from 'prop-types';
import { formatTime } from '../../../../../shared/timeUtils';
import './MapPointPopup.scss';

/**
 * Componente de popup para pontos no mapa
 * Exibe informações do ponto de forma intuitiva e bonita
 */
const MapPointPopup = ({ stop, isUserStop = false }) => {
    const horarioFormatado = stop.horario_previsto_passagem 
        ? formatTime(stop.horario_previsto_passagem)
        : stop.horario 
        ? formatTime(stop.horario)
        : null;

    return (
        <div className="map-popup-container">
            {/* Header com ícone e título */}
            <div className="popup-header">
                <div className="popup-header-content">
                    <div className="popup-icon-wrapper">
                        <div className="popup-icon">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        {isUserStop && (
                            <div className="popup-badge">
                                <i className="bi bi-check-circle-fill"></i>
                            </div>
                        )}
                    </div>
                    <div className="popup-title-section">
                        <h3 className="popup-title">{stop.nome}</h3>
                        {isUserStop && (
                            <div className="popup-subtitle">Seu ponto de embarque</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Horário de passagem - DESTAQUE PRINCIPAL */}
            {horarioFormatado && (
                <div className="popup-time-section">
                    <div className="popup-time-content">
                        <div className="popup-time-icon">
                            <i className="bi bi-clock-fill"></i>
                        </div>
                        <div className="popup-time-text">
                            <div className="popup-time-label">Horário de passagem</div>
                            <div className="popup-time-value">{horarioFormatado}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Endereço - INFORMAÇÕES COMPLETAS */}
            {stop.logradouro && (
                <div className="popup-address-section">
                    <div className="popup-address-content">
                        <div className="popup-address-icon">
                            <i className="bi bi-geo-fill"></i>
                        </div>
                        <div className="popup-address-text">
                            <div className="popup-address-main">
                                {stop.logradouro}
                                {stop.numero_endereco && `, ${stop.numero_endereco}`}
                            </div>
                            {(stop.bairro || stop.cidade) && (
                                <div className="popup-address-secondary">
                                    {stop.bairro && <span>{stop.bairro}</span>}
                                    {stop.bairro && stop.cidade && <span> • </span>}
                                    {stop.cidade && stop.uf && <span>{stop.cidade} - {stop.uf}</span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Referência - INFORMAÇÃO ADICIONAL */}
            {stop.referencia && (
                <div className="popup-reference-section">
                    <div className="popup-reference-content">
                        <div className="popup-reference-icon">
                            <i className="bi bi-info-circle-fill"></i>
                        </div>
                        <div className="popup-reference-text">
                            <div className="popup-reference-label">Referência</div>
                            <div className="popup-reference-value">{stop.referencia}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer com ID */}
            <div className="popup-footer">
                <div className="popup-id">
                    <i className="bi bi-hash"></i>
                    <span>ID: {stop.ponto_id}</span>
                </div>
            </div>
        </div>
    );
};

MapPointPopup.propTypes = {
    stop: PropTypes.shape({
        ponto_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nome: PropTypes.string.isRequired,
        logradouro: PropTypes.string,
        numero_endereco: PropTypes.string,
        bairro: PropTypes.string,
        cidade: PropTypes.string,
        uf: PropTypes.string,
        referencia: PropTypes.string,
        horario_previsto_passagem: PropTypes.string,
        horario: PropTypes.string,
        latitude: PropTypes.number,
        longitude: PropTypes.number
    }).isRequired,
    isUserStop: PropTypes.bool
};

MapPointPopup.defaultProps = {
    isUserStop: false
};

export default MapPointPopup;
