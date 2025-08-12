import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCacheManager } from '@web/hooks';

/**
 * Componente para exibir e gerenciar estatísticas do cache de rotas
 */
export const CacheStats = ({ 
    cacheStats, 
    show = false, 
    className = "",
    onClose = () => {} 
}) => {
    const [detailedStats, setDetailedStats] = useState(null);
    const { clearCache, getStats, saveToLocalStorage } = useCacheManager();

    useEffect(() => {
        if (show) {
            const stats = getStats();
            setDetailedStats(stats);
        }
    }, [show, getStats]);

    const handleClearCache = () => {
        if (window.confirm('Tem certeza que deseja limpar todo o cache de rotas?')) {
            clearCache();
            setDetailedStats(getStats());
        }
    };

    const handleSaveCache = () => {
        saveToLocalStorage();
        alert('Cache salvo com sucesso!');
    };

    if (!show) return null;

    return (
        <div className={`cache-stats-modal ${className}`}>
            <div className="modal-backdrop d-block"></div>
            <div className="modal d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="bi bi-hdd-stack me-2"></i>
                                Estatísticas do Cache de Rotas
                            </h5>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={onClose}
                            ></button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Estatísticas Gerais */}
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <div className="card bg-primary text-white">
                                        <div className="card-body text-center">
                                            <i className="bi bi-bullseye fs-2"></i>
                                            <h3 className="mt-2">{cacheStats.hits}</h3>
                                            <p className="mb-0">Cache Hits</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-4">
                                    <div className="card bg-warning text-white">
                                        <div className="card-body text-center">
                                            <i className="bi bi-cloud-arrow-down fs-2"></i>
                                            <h3 className="mt-2">{cacheStats.apiCalls}</h3>
                                            <p className="mb-0">API Calls</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-md-4">
                                    <div className="card bg-success text-white">
                                        <div className="card-body text-center">
                                            <i className="bi bi-percent fs-2"></i>
                                            <h3 className="mt-2">{cacheStats.hitRate}%</h3>
                                            <p className="mb-0">Hit Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Estatísticas Detalhadas */}
                            {detailedStats && (
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-diagram-2 me-2"></i>
                                                    Cache de Segmentos
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <small className="text-muted">Total:</small>
                                                        <div className="fw-bold">{detailedStats.segmentCache.total}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Válidos:</small>
                                                        <div className="fw-bold text-success">{detailedStats.segmentCache.valid}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Expirados:</small>
                                                        <div className="fw-bold text-warning">{detailedStats.segmentCache.expired}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Uso:</small>
                                                        <div className="fw-bold">{detailedStats.segmentCache.usage}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="progress mt-2">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ 
                                                            width: detailedStats.segmentCache.usage 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <h6 className="mb-0">
                                                    <i className="bi bi-arrow-right-circle me-2"></i>
                                                    Cache de Sequências
                                                </h6>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <small className="text-muted">Total:</small>
                                                        <div className="fw-bold">{detailedStats.sequenceCache.total}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Válidos:</small>
                                                        <div className="fw-bold text-success">{detailedStats.sequenceCache.valid}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Expirados:</small>
                                                        <div className="fw-bold text-warning">{detailedStats.sequenceCache.expired}</div>
                                                    </div>
                                                    <div className="col-6">
                                                        <small className="text-muted">Uso:</small>
                                                        <div className="fw-bold">{detailedStats.sequenceCache.usage}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="progress mt-2">
                                                    <div 
                                                        className="progress-bar" 
                                                        style={{ 
                                                            width: detailedStats.sequenceCache.usage 
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Benefícios do Cache */}
                            <div className="mt-4">
                                <div className="alert alert-info">
                                    <h6 className="alert-heading">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Benefícios do Cache
                                    </h6>
                                    <ul className="mb-0">
                                        <li><strong>Economia de API calls:</strong> {cacheStats.hits} requisições evitadas</li>
                                        <li><strong>Carregamento mais rápido:</strong> Rotas instantâneas para pontos já calculados</li>
                                        <li><strong>Menos consumo de dados:</strong> Reduz tráfego de rede</li>
                                        <li><strong>Melhor experiência:</strong> Interface mais responsiva</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                type="button" 
                                className="btn btn-outline-primary"
                                onClick={handleSaveCache}
                            >
                                <i className="bi bi-download me-2"></i>
                                Salvar Cache
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn btn-outline-warning"
                                onClick={handleClearCache}
                            >
                                <i className="bi bi-trash me-2"></i>
                                Limpar Cache
                            </button>
                            
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

CacheStats.propTypes = {
    cacheStats: PropTypes.shape({
        hits: PropTypes.number.isRequired,
        apiCalls: PropTypes.number.isRequired,
        hitRate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    }).isRequired,
    show: PropTypes.bool,
    className: PropTypes.string,
    onClose: PropTypes.func
};

CacheStats.defaultProps = {
    show: false,
    className: "",
    onClose: () => {}
};
