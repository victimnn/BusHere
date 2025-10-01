import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de popup para localização atual do usuário
 * Refatorado seguindo o design system do webapp
 * Otimizado para dispositivos móveis com elementos maiores e harmonia visual
 * 
 * @param {Object} position - Objeto contendo latitude, longitude e altitude
 * @param {string} geoError - Mensagem de erro de geolocalização (opcional)
 * @returns {JSX.Element} Componente de popup estilizado
 */
const UserLocationPopup = ({ position, geoError = null }) => {
    // Validar se position é válido
    if (!position || typeof position.latitude !== 'number' || typeof position.longitude !== 'number') {
        return null;
    }
    // Formatar coordenadas para exibição
    const formatCoordinate = (coord) => {
        return typeof coord === 'number' ? coord.toFixed(6) : 'N/A';
    };

    // Formatar altitude - Melhorada para evitar valores falsy
    const formatAltitude = (altitude) => {
        // Verificar se altitude existe e é um número válido maior que 0
        if (altitude !== null && altitude !== undefined && typeof altitude === 'number' && altitude > 0 && !isNaN(altitude)) {
            return `${altitude.toFixed(1)}m`;
        }
        return null; // Retorna null para evitar renderização
    };

    // Obter horário atual formatado
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const currentTime = getCurrentTime();

    return (
        <div className="map-popup-container">
            {/* Header principal com ícone, título e badge - Layout reorganizado */}
            <div className="popup-header">
                <div className="popup-header-content">
                    <div className="popup-icon-wrapper">
                        <div className="popup-icon">
                            <i className="bi bi-geo-alt-fill"></i>
                        </div>
                        <div className="popup-badge">
                            <i className="bi bi-person-circle-fill"></i>
                        </div>
                    </div>
                    <div className="popup-title-section">
                        <h3 className="popup-title font-family-principal">Sua Localização</h3>
                        <div className="popup-subtitle font-family-segundaria">Posição atual detectada</div>
                    </div>
                </div>

                {/* ID movido para o header para melhor organização */}
                <div className="popup-id-header font-family-segundaria">
                    <i className="bi bi-clock-fill"></i>
                    <span>Atualizado: {currentTime}</span>
                </div>
            </div>

            {/* Seção principal de informações - Layout vertical harmonioso */}
            <div className="popup-main-content">
                {/* Coordenadas - DESTAQUE PRINCIPAL */}
                <div className="popup-time-section">
                    <div className="popup-time-content">
                        <div className="popup-time-icon">
                            <i className="bi bi-geo-fill"></i>
                        </div>
                        <div className="popup-time-text">
                            <div className="popup-time-label font-family-segundaria">Coordenadas GPS</div>
                            <div className="popup-time-value font-family-principal">
                                {formatCoordinate(position.latitude)}, {formatCoordinate(position.longitude)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Altitude - INFORMAÇÕES COMPLETAS - Só renderiza se altitude válida */}
                {position.altitude !== null && position.altitude !== undefined && typeof position.altitude === 'number' && position.altitude > 0 && (
                    <div className="popup-address-section">
                        <div className="popup-address-content">
                            <div className="popup-address-icon">
                                <i className="bi bi-arrow-up-circle-fill"></i>
                            </div>
                            <div className="popup-address-text">
                                <div className="popup-address-main font-family-principal">
                                    Altitude: {formatAltitude(position.altitude) || 'N/A'}
                                </div>
                                <div className="popup-address-secondary font-family-segundaria">
                                    Altura acima do nível do mar
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status de precisão - INFORMAÇÃO ADICIONAL */}
                <div className="popup-reference-section">
                    <div className="popup-reference-content">
                        <div className="popup-reference-icon">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <div className="popup-reference-text">
                            <div className="popup-reference-label font-family-segundaria">Status</div>
                            <div className="popup-reference-value font-family-principal">
                                {geoError ? 'Erro na localização' : 'Localização precisa'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensagem de erro se houver */}
                {geoError && (
                    <div className="popup-error-section">
                        <div className="popup-error-content">
                            <div className="popup-error-icon">
                                <i className="bi bi-exclamation-triangle-fill"></i>
                            </div>
                            <div className="popup-error-text">
                                <div className="popup-error-label font-family-segundaria">Aviso</div>
                                <div className="popup-error-value font-family-principal">{geoError}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

UserLocationPopup.propTypes = {
    position: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        altitude: PropTypes.number
    }).isRequired,
    geoError: PropTypes.string
};

export default UserLocationPopup;
