import React from 'react';
import StopsContainer from './StopsContainer';

const StopsListSection = ({ stops, stopsStats }) => {
  return (
    <div className="col-lg-4 stops-list-section">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-header bg-light py-2">
          <h6 className="mb-0 fw-semibold">
            <i className="bi bi-list-ul me-2"></i>
            Lista de Pontos
          </h6>
        </div>
        <div className="card-body p-0" style={{ height: "400px", overflowY: "auto" }}>
          <StopsContainer stops={stops} stopsStats={stopsStats} />
        </div>
      </div>
    </div>
  );
};

export default StopsListSection;
