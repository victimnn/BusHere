import React, { useState, forwardRef, useImperativeHandle, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import ActionButton from './ActionButton';

/**
 * Componente ConfirmDialog reutilizável para substituir window.confirm
 * Utiliza forwardRef para permitir acesso às funções show/hide por componentes pais
 * Implementa memo para otimização de performance
 */
const ConfirmDialog = memo(forwardRef((props, ref) => {
  const [dialogState, setDialogState] = useState({
    isVisible: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    type: 'info', // info, warning, danger, success
    onConfirm: null,
    onCancel: null,
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
   * @param {string} params.confirmText - Texto do botão de confirmação
   * @param {string} params.cancelText - Texto do botão de cancelamento
   * @param {string} params.type - Tipo do dialog (info, warning, danger, success)
   * @param {Function} params.onConfirm - Callback executado ao confirmar
   * @param {Function} params.onCancel - Callback executado ao cancelar
   */
  const show = useCallback(({
    title = 'Confirmação',
    message = 'Tem certeza que deseja continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info',
    onConfirm = null,
    onCancel = null,
  }) => {
    setDialogState({
      isVisible: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm,
      onCancel,
    });
    document.body.classList.add('modal-open');
  }, []);

  /**
   * Função para confirmar a ação
   */
  const handleConfirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    hide();
  }, [dialogState, hide]);

  /**
   * Função para cancelar a ação
   */
  const handleCancel = useCallback(() => {
    if (dialogState.onCancel) {
      dialogState.onCancel();
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
  const { isVisible, title, message, confirmText, cancelText, type } = dialogState;

  // Se o dialog não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'confirm-success';
      case 'error':
      case 'danger':
        return 'confirm-danger';
      case 'warning':
        return 'confirm-warning';
      case 'info':
      default:
        return 'confirm-info';
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
      aria-labelledby="confirmDialogLabel"
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
        <div className={`modal-content confirm-dialog ${getTypeClasses()}`}>
          {/* Cabeçalho do dialog */}
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <i className={`bi ${getIcon()} me-2 fs-4`}></i>
              <h5 className="modal-title mb-0" id="confirmDialogLabel">
                {title}
              </h5>
            </div>
          </div>
          
          {/* Corpo do dialog */}
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          
                     {/* Rodapé do dialog com botões */}
           <div className="modal-footer d-flex gap-2 justify-content-end">
             <ActionButton
               onClick={handleCancel}
               variant="outline-secondary"
               size="md"
               text={cancelText}
               icon="bi-x-circle"
               className="flex-shrink-0"
             />
             <ActionButton
               onClick={handleConfirm}
               variant={type === 'danger' || type === 'error' ? 'danger' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'primary'}
               size="md"
               text={confirmText}
               icon={type === 'danger' || type === 'error' ? 'bi-check-circle' : type === 'warning' ? 'bi-exclamation-triangle' : type === 'success' ? 'bi-check-circle' : 'bi-check'}
               className="flex-shrink-0"
             />
           </div>
        </div>
      </div>
    </div>
  );
}));

// Define o nome do componente para debugging
ConfirmDialog.displayName = 'ConfirmDialog';

// Define os tipos de propriedades esperadas pelo componente
ConfirmDialog.propTypes = {
  // Atualmente não há props diretas, mas pode ser expandido conforme necessário
  // As props são passadas através das funções show() expostas pela ref
};

export default ConfirmDialog;
