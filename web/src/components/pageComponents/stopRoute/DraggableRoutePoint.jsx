import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  ROUTE_POINT: 'routePoint'
};

const DraggableRoutePoint = ({ 
  ponto, 
  index, 
  movePoint, 
  onRemove, 
  segmentInfo 
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.ROUTE_POINT,
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
      movePoint(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ROUTE_POINT,
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
      className={`list-group-item draggable-route-point border-0 ${isDragging ? 'is-dragging' : ''}`}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="d-flex align-items-center py-2">
        <div className="drag-handle me-3">
          <i className="fas fa-grip-vertical text-muted"></i>
        </div>
        
        <div className="position-relative me-3">
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
        </div>
        
        <button 
          className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center ms-2"
          onClick={() => onRemove(index)}
          title="Remover ponto"
          style={{ width: '32px', height: '32px' }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default DraggableRoutePoint;
