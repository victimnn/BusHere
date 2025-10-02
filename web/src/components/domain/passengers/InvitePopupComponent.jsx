import React, { useState, forwardRef, useImperativeHandle, useCallback, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../common/feedback/Dialog';

/**
 * Estilos para o overlay do modal com largura aumentada
 */
const styles = {
  fullScreenOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1040,
    overflowX: 'hidden',
    overflowY: 'auto',
    outline: 0,
  },
  largeModal: {
    maxWidth: '90vw',
    width: '1200px',
    minHeight: '600px'
  }
};

/**
 * Componente PopUp customizado para convites com largura aumentada
 */
const InvitePopupComponent = memo(forwardRef((props, ref) => {
  const [modalState, setModalState] = useState({
    isVisible: false,
    ContentComponent: null,
    componentProps: {},
    title: '',
  });

  const hide = useCallback(() => {
    setModalState({
      isVisible: false,
      ContentComponent: null,
      componentProps: {},
      title: '',
    });
    document.body.classList.remove('modal-open');
  }, []);

  const hideWithConfirm = useCallback(() => {
    if (dialogRef.current) {
      dialogRef.current.showConfirm({
        title: 'Confirmar Saída',
        message: 'Tem certeza que deseja sair do gerenciador de convites?',
        confirmText: 'Sair',
        cancelText: 'Cancelar',
        type: 'warning',
        onConfirm: hide,
        onCancel: () => {}
      });
    }
  }, [hide]);

  const show = useCallback(({ content, props = {}, title = '' }) => {
    setModalState({
      isVisible: true,
      ContentComponent: () => content({ close: hide, ...props }),
      componentProps: props,
      title,
    });
    document.body.classList.add('modal-open');
  }, [hide]);

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }), [show, hide]);

  const dialogRef = useRef();
  const { isVisible, ContentComponent, componentProps, title } = modalState;

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`modal fade ${isVisible ? 'show' : ''}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="inviteModalLabel"
      aria-hidden={!isVisible}
      style={{
        display: isVisible ? 'block' : 'none',
        ...styles.fullScreenOverlay,
      }}
      onClick={hideWithConfirm}
    >
      {/* Container do modal com largura customizada */}
      <div 
        className="modal-dialog modal-dialog-centered d-flex justify-content-center" 
        onClick={(e) => e.stopPropagation()}
        style={styles.largeModal}
      >
        <div className="modal-content h-100">
          {/* Cabeçalho do modal */}
          <div className="modal-header border-bottom">
            {title && <h5 className="modal-title" id="inviteModalLabel">{title}</h5>}
            <button 
              type="button" 
              className="btn-close btn-close-lg" 
              aria-label="Fechar" 
              onClick={hide}
            ></button>
          </div>
          
          {/* Corpo do modal com scroll */}
          <div className="modal-body p-0" style={{ overflowY: 'auto', maxHeight: '70vh' }}>
            {ContentComponent && <ContentComponent {...componentProps} />}
          </div>
        </div>
      </div>
      
      {/* Dialog unificado para confirmações */}
      <Dialog ref={dialogRef} />
    </div>
  );
}));

InvitePopupComponent.displayName = 'InvitePopupComponent';

InvitePopupComponent.propTypes = {
  // Props são passadas através das funções show() expostas pela ref
};

export default InvitePopupComponent;
