function MajorStops({ stops = [], stopsStats = [] }) {
  return (
    <StopsContainer stops={stops} stopsStats={stopsStats} />
  );
}

function StopsContainer({ stops, stopsStats = [] }) {
  // Função para encontrar estatísticas de um ponto específico
  const getStopStats = (pontoId) => {
    const stats = stopsStats.find(stat => stat.ponto_id === pontoId);
    return {
      passengers: stats?.total_passengers || 0,
      routes: stats?.total_routes || 0
    };
  };

  return (
     <div className="w-100 h-100 stops-container" style={{ overflowY: "auto" }}>
      {/* Content */}
      <div className="p-3">
        {stops.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {stops.map((stop, index) => {
              const stats = getStopStats(stop.ponto_id);
              return (
                <StopComponent 
                  key={stop.ponto_id || index}
                  name={stop.nome} 
                  passengers={stats.passengers}
                  routeAmount={stats.routes}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted p-4 empty-state">
            <i className="bi bi-geo text-muted fs-3 mb-2 d-block"></i>
            <p className="mb-0">Nenhum ponto cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StopComponent({ name = "", passengers = "", routeAmount = "" }) {
  return (
    <div className="border rounded-2 p-3 bg-light stop-component">
      <div className="d-flex align-items-center">
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
             style={{ width: "32px", height: "32px", minWidth: "32px" }}>
          <i className="bi bi-geo-alt-fill text-white" style={{ fontSize: "0.8rem" }}></i>
        </div>
        <div className="flex-grow-1">
          <h6 className="mb-1 text-truncate">{name}</h6>
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center">
              <i className="bi bi-people-fill text-primary me-1" style={{ fontSize: "0.7rem" }}></i>
              <small className="text-muted">{passengers}</small>
            </div>
            <div className="d-flex align-items-center">
              <i className="bi bi-diagram-3-fill text-success me-1" style={{ fontSize: "0.7rem" }}></i>
              <small className="text-muted">{routeAmount}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MajorStops;
