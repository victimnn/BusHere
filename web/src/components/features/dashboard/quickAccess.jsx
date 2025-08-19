import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickAccess = ({ quickAccessItems }) => {
    const navigate = useNavigate();

    return (
        <div className="quick-access-container">
            <div className="row mb-2 mb-md-3">
                <div className="col">
                    <h2 className="h5 h6-md mb-2 mb-md-3">Acesso Rápido</h2>
                </div>
            </div>

            <div className="row g-2 g-md-3">
                {quickAccessItems.map((item, index) => (
                    <div key={index} className="col-lg-3 col-md-6 col-6">
                        <div 
                            className="card h-100 text-center shadow-sm card-hover quick-access-card"
                            onClick={() => navigate(item.path)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body d-flex flex-column justify-content-center align-items-center p-2 p-md-3">
                                <i className={`${item.icon} fs-2 fs-md-3 text-${item.color} mb-1 mb-md-2`}></i>
                                <h6 className={`card-title mb-0 small text-${item.color}`}>{item.title}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuickAccess;