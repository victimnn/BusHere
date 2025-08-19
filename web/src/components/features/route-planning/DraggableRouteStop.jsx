import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  ROUTE_STOP: 'routeStop'
};

const DraggableRouteStop = ({ 
  ponto, 
  index, 
  moveStop, 
  onRemove, 
  segmentInfo,
  onTimeChange,
  timeValidationError
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.ROUTE_STOP,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveStop(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ROUTE_STOP,
    item: () => {
      return { id: ponto.id || ponto.ponto_id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      className={`list-group-item draggable-route-point border-0 ${isDragging ? 'is-dragging' : ''} ${timeValidationError ? 'has-time-error' : ''}`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="d-flex py-2">
        <div className="drag-handle me-3 d-flex align-items-start pt-1">
          <i className="fas fa-grip-vertical text-muted"></i>
        </div>
        
        <div className="position-relative me-3 d-flex align-items-start pt-1">
          <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', fontSize: '0.875rem' }}>
            {index + 1}
          </span>
        </div>
        
        <div className="flex-grow-1">
          <div className="fw-bold text-dark mb-1" style={{ fontSize: '0.95rem' }}>
            {ponto.nome || `Ponto ${index + 1}`}
          </div>
          <div className="d-flex align-items-center text-muted small">
            <i className="fas fa-map-pin me-1"></i>
            <span>{ponto.latitude?.toFixed(6)}, {ponto.longitude?.toFixed(6)}</span>
          </div>
          {segmentInfo && (
            <div className="d-flex align-items-center text-success small mt-1">
              <i className="fas fa-route me-1"></i>
              <span className="fw-medium">{segmentInfo.distance.toFixed(2)} km</span>
            </div>
          )}
          
          {/* Container para input de horário */}
          <div className="time-input-container mt-2">
            <div className="time-input-wrapper">
              <i className="fas fa-clock text-primary" style={{ fontSize: '0.8rem' }}></i>
              <label className="form-label mb-0 small text-muted" style={{ minWidth: 'fit-content' }}>
                Horário:
              </label>
              <input
                type="time"
                className={`form-control form-control-sm ${timeValidationError ? 'is-invalid time-input-invalid' : ''}`}
                style={{ width: '120px', fontSize: '0.85rem', flexShrink: 0 }}
                value={ponto.horario_previsto_passagem || ''}
                onChange={(e) => onTimeChange && onTimeChange(index, e.target.value)}
                placeholder="--:--"
                title="Horário previsto de passagem"
              />
            </div>
            {timeValidationError && (
              <div className="time-error-message">
                <small className="text-danger d-block">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {timeValidationError}
                </small>
              </div>
            )}
          </div>
        </div>
        
        <div className="remove-button-container d-flex align-items-start pt-1">
          <button 
            className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
            onClick={() => onRemove(index)}
            title="Remover ponto"
            style={{ width: '32px', height: '32px' }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraggableRouteStop;
