import React, { useState, forwardRef, useImperativeHandle, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import ActionButton from './ActionButton';

/**
 * Componente AlertDialog reutilizável para substituir window.alert
 * Utiliza forwardRef para permitir acesso às funções show/hide por componentes pais
 * Implementa memo para otimização de performance
 */
const AlertDialog = memo(forwardRef((props, ref) => {
  const [dialogState, setDialogState] = useState({
    isVisible: false,
    title: '',
    message: '',
    buttonText: 'OK',
    type: 'info', // info, warning, danger, success
    onClose: null,
  });

  /**
   * Função para ocultar o dialog
   */
  const hide = useCallback(() => {
    setDialogState(prev => ({
      ...prev,
      isVisible: false,
    }));
    document.body.classList.remove('modal-open');
  }, []);

  /**
   * Função para exibir o dialog
   * @param {Object} params - Parâmetros do dialog
   * @param {string} params.title - Título do dialog
   * @param {string} params.message - Mensagem do dialog
   * @param {string} params.buttonText - Texto do botão de fechar
   * @param {string} params.type - Tipo do dialog (info, warning, danger, success)
   * @param {Function} params.onClose - Callback executado ao fechar
   */
  const show = useCallback(({
    title = 'Aviso',
    message = '',
    buttonText = 'OK',
    type = 'info',
    onClose = null,
  }) => {
    setDialogState({
      isVisible: true,
      title,
      message,
      buttonText,
      type,
      onClose,
    });
    document.body.classList.add('modal-open');
  }, []);

  /**
   * Função para fechar o dialog
   */
  const handleClose = useCallback(() => {
    if (dialogState.onClose) {
      dialogState.onClose();
    }
    hide();
  }, [dialogState, hide]);

  /**
   * Expõe as funções show e hide para componentes pais através da ref
   */
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }), [show, hide]);

  // Desestrutura o estado do dialog
  const { isVisible, title, message, buttonText, type } = dialogState;

  // Se o dialog não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
      case 'danger':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
      case 'danger':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="alertDialogLabel"
      aria-hidden="false"
      style={{
        display: 'block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1050,
        overflowX: 'hidden',
        overflowY: 'auto',
        outline: 0,
      }}
    >
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-content alert-dialog ${getTypeClasses()}`}>
          {/* Cabeçalho do dialog */}
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <i className={`bi ${getIcon()} me-2 fs-4`}></i>
              <h5 className="modal-title mb-0" id="alertDialogLabel">
                {title}
              </h5>
            </div>
          </div>
          
          {/* Corpo do dialog */}
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          
                     {/* Rodapé do dialog com botão */}
           <div className="modal-footer d-flex justify-content-end">
             <ActionButton
               onClick={handleClose}
               variant={type === 'danger' || type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'primary'}
               size="md"
               text={buttonText}
               icon={type === 'danger' || type === 'error' ? 'bi-exclamation-triangle' : type === 'warning' ? 'bi-exclamation-circle' : type === 'success' ? 'bi-check-circle' : 'bi-info-circle'}
               className="flex-shrink-0"
             />
           </div>
        </div>
      </div>
    </div>
  );
}));

// Define o nome do componente para debugging
AlertDialog.displayName = 'AlertDialog';

// Define os tipos de propriedades esperadas pelo componente
AlertDialog.propTypes = {
  // Atualmente não há props diretas, mas pode ser expandido conforme necessário
  // As props são passadas através das funções show() expostas pela ref
};

export default AlertDialog;
