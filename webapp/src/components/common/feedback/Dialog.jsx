import React, { useState, forwardRef, useImperativeHandle, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

/**
 * Componente Dialog unificado que substitui ConfirmDialog e AlertDialog
 * Pode funcionar como alert (um botão) ou confirm (dois botões)
 * Utiliza forwardRef para permitir acesso às funções show/hide por componentes pais
 * Implementa memo para otimização de performance
 */
const Dialog = memo(forwardRef((props, ref) => {
  const [dialogState, setDialogState] = useState({
    isVisible: false,
    title: '',
    message: '',
    type: 'info', // info, warning, danger, success
    mode: 'alert', // 'alert' ou 'confirm'
    // Para modo alert
    buttonText: 'OK',
    onClose: null,
    // Para modo confirm
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
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
   * Função para exibir o dialog como alert
   * @param {Object} params - Parâmetros do dialog
   * @param {string} params.title - Título do dialog
   * @param {string} params.message - Mensagem do dialog
   * @param {string} params.buttonText - Texto do botão de fechar
   * @param {string} params.type - Tipo do dialog (info, warning, danger, success)
   * @param {Function} params.onClose - Callback executado ao fechar
   */
  const showAlert = useCallback(({
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
      type,
      mode: 'alert',
      buttonText,
      onClose,
      // Reset dos campos do modo confirm
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm: null,
      onCancel: null,
    });
    document.body.classList.add('modal-open');
  }, []);

  /**
   * Função para exibir o dialog como confirm
   * @param {Object} params - Parâmetros do dialog
   * @param {string} params.title - Título do dialog
   * @param {string} params.message - Mensagem do dialog
   * @param {string} params.confirmText - Texto do botão de confirmação
   * @param {string} params.cancelText - Texto do botão de cancelamento
   * @param {string} params.type - Tipo do dialog (info, warning, danger, success)
   * @param {Function} params.onConfirm - Callback executado ao confirmar
   * @param {Function} params.onCancel - Callback executado ao cancelar
   */
  const showConfirm = useCallback(({
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
      type,
      mode: 'confirm',
      confirmText,
      cancelText,
      onConfirm,
      onCancel,
      // Reset dos campos do modo alert
      buttonText: 'OK',
      onClose: null,
    });
    document.body.classList.add('modal-open');
  }, []);

  /**
   * Função para fechar o dialog (modo alert)
   */
  const handleClose = useCallback(() => {
    if (dialogState.onClose) {
      dialogState.onClose();
    }
    hide();
  }, [dialogState, hide]);

  /**
   * Função para confirmar a ação (modo confirm)
   */
  const handleConfirm = useCallback(() => {
    if (dialogState.onConfirm) {
      dialogState.onConfirm();
    }
    hide();
  }, [dialogState, hide]);

  /**
   * Função para cancelar a ação (modo confirm)
   */
  const handleCancel = useCallback(() => {
    if (dialogState.onCancel) {
      dialogState.onCancel();
    }
    hide();
  }, [dialogState, hide]);

  /**
   * Expõe as funções showAlert, showConfirm e hide para componentes pais através da ref
   */
  useImperativeHandle(ref, () => ({
    showAlert,
    showConfirm,
    hide,
  }), [showAlert, showConfirm, hide]);

  // Desestrutura o estado do dialog
  const { isVisible, title, message, type, mode, buttonText, confirmText, cancelText } = dialogState;

  // Se o dialog não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return mode === 'alert' ? 'alert-success' : 'confirm-success';
      case 'error':
      case 'danger':
        return mode === 'alert' ? 'alert-danger' : 'confirm-danger';
      case 'warning':
        return mode === 'alert' ? 'alert-warning' : 'confirm-warning';
      case 'info':
      default:
        return mode === 'alert' ? 'alert-info' : 'confirm-info';
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

  const getButtonIcon = () => {
    if (mode === 'alert') {
      switch (type) {
        case 'danger':
        case 'error':
          return 'bi-exclamation-triangle';
        case 'warning':
          return 'bi-exclamation-circle';
        case 'success':
          return 'bi-check-circle';
        case 'info':
        default:
          return 'bi-info-circle';
      }
    } else {
      // Modo confirm
      switch (type) {
        case 'danger':
        case 'error':
          return 'bi-check-circle';
        case 'warning':
          return 'bi-exclamation-triangle';
        case 'success':
          return 'bi-check-circle';
        case 'info':
        default:
          return 'bi-check';
      }
    }
  };

  const getButtonVariant = () => {
    if (mode === 'alert') {
      switch (type) {
        case 'danger':
        case 'error':
          return 'danger';
        case 'warning':
          return 'warning';
        case 'success':
          return 'success';
        case 'info':
        default:
          return 'primary';
      }
    } else {
      // Modo confirm
      switch (type) {
        case 'danger':
        case 'error':
          return 'danger';
        case 'warning':
          return 'warning';
        case 'success':
          return 'success';
        case 'info':
        default:
          return 'primary';
      }
    }
  };

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      role="dialog"
      aria-labelledby={`${mode}DialogLabel`}
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
        <div className={`modal-content ${mode}-dialog ${getTypeClasses()}`}>
          {/* Cabeçalho do dialog */}
          <div className="modal-header">
            <div className="d-flex align-items-center">
              <i className={`bi ${getIcon()} me-2 fs-4`}></i>
              <h5 className="modal-title mb-0" id={`${mode}DialogLabel`}>
                {title}
              </h5>
            </div>
          </div>
          
          {/* Corpo do dialog */}
          <div className="modal-body">
            <p className="mb-0">{message}</p>
          </div>
          
          {/* Rodapé do dialog com botões */}
          <div className={`modal-footer d-flex gap-2 justify-content-end ${mode === 'alert' ? '' : 'gap-2'}`}>
            {mode === 'confirm' && (
              <ActionButton
                onClick={handleCancel}
                variant="outline-secondary"
                size="md"
                text={cancelText}
                icon="bi-x-circle"
                className="flex-shrink-0"
              />
            )}
            <ActionButton
              onClick={mode === 'alert' ? handleClose : handleConfirm}
              variant={getButtonVariant()}
              size="md"
              text={mode === 'alert' ? buttonText : confirmText}
              icon={getButtonIcon()}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}));

// Define o nome do componente para debugging
Dialog.displayName = 'Dialog';

// Define os tipos de propriedades esperadas pelo componente
Dialog.propTypes = {
  // Atualmente não há props diretas, mas pode ser expandido conforme necessário
  // As props são passadas através das funções showAlert() e showConfirm() expostas pela ref
};

export default Dialog;
