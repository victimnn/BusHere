function MajorStops({ stops = [] }) {
  return (
    <StopsContainer stops={stops} />
  );
}

function StopsContainer({ stops }) {
  return (
     <div className="w-100 h-100" style={{ overflowY: "auto" }}>
      {/* Content */}
      <div className="p-3">
        {stops.length > 0 ? (
          <div className="d-flex flex-column gap-2">
            {stops.map((stop, index) => (
              <StopComponent 
                key={stop.ponto_id || index}
                name={stop.nome} 
                passengers={Math.ceil(Math.random() * 40)}
                routeAmount={Math.ceil(Math.random() * 10)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted p-4">
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
    <div className="border rounded-2 p-3 bg-light">
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
