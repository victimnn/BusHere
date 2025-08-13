
import StopDetails from "./StopDetails";
import { formatAddress, formatCoordinates } from '@web/utils/routeStopsUtils';

function MarkerPopUpContent({ stop, popUpRef, onDelete, onEdit }) {
  return (
    <div className="card shadow-sm border-0 p-3" style={{ minWidth: '280px', maxWidth: '320px' }}>
      {/* Header com nome e status */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="flex-grow-1">
          <h5 className="mb-1 text-primary fw-bold">{stop.nome}</h5>
          <span className={`badge ${stop.ativo ? 'bg-success' : 'bg-secondary'} mb-2`}>
            {stop.ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      {/* Informações do endereço */}
      <div className="mb-3">
        <div className="d-flex align-items-start mb-2">
          <i className="bi bi-geo-alt-fill text-danger me-2 mt-1"></i>
          <div className="flex-grow-1">
            <small className="text-muted d-block">Endereço:</small>
            <span className="fw-medium text-dark">
              {stop.logradouro}, {stop.numero_endereco}
            </span>
            <br />
            <span className="text-muted">
              {stop.bairro}, {stop.cidade} - {stop.uf}
            </span>
          </div>
        </div>

        {/* Referência */}
        {stop.referencia && (
          <div className="d-flex align-items-start mb-2">
            <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
            <div className="flex-grow-1">
              <small className="text-muted d-block">Referência:</small>
              <span className="text-dark">{stop.referencia}</span>
            </div>
          </div>
        )}

        {/* Coordenadas */}
        <div className="d-flex align-items-start">
          <i className="bi bi-crosshair text-secondary me-2 mt-1"></i>
          <div className="flex-grow-1">
            <small className="text-muted d-block">Coordenadas:</small>
            <code className="small bg-medium text-dark px-2 py-1 rounded coordinates-code">
              {formatCoordinates(parseFloat(stop.latitude), parseFloat(stop.longitude), 4)}
            </code>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="d-grid">
        <button 
          className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2"
          onClick={() => {
            if (popUpRef && popUpRef.current) {
              popUpRef.current.show({
                title: `Detalhes do Ponto: ${stop.nome}`,
                content: StopDetails,
                props: {
                  stop: stop,
                  onEdit: () => onEdit(stop.ponto_id),
                  onDelete: onDelete ? () => onDelete(stop.ponto_id) : null,
                }
              });
            } else {
              console.error("PopUpComponent não está definido ou não possui a referência correta.");
            }
          }}
        >
          <i className="bi bi-eye-fill"></i>
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}

export default MarkerPopUpContent;
