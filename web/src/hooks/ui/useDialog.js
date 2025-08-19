import { useRef, useCallback } from 'react';

/**
 * Hook personalizado para facilitar o uso dos componentes ConfirmDialog e AlertDialog
 * Fornece funções para exibir diálogos de confirmação e alerta
 */
export const useDialog = () => {
  const confirmDialogRef = useRef();
  const alertDialogRef = useRef();

  /**
   * Exibe um diálogo de confirmação
   * @param {Object} options - Opções do diálogo
   * @param {string} options.title - Título do diálogo
   * @param {string} options.message - Mensagem do diálogo
   * @param {string} options.confirmText - Texto do botão de confirmação
   * @param {string} options.cancelText - Texto do botão de cancelamento
   * @param {string} options.type - Tipo do diálogo (info, warning, danger, success)
   * @returns {Promise<boolean>} - Promise que resolve com true se confirmado, false se cancelado
   */
  const confirm = useCallback(({
    title = 'Confirmação',
    message = 'Tem certeza que deseja continuar?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info',
  } = {}) => {
    return new Promise((resolve) => {
      confirmDialogRef.current?.show({
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  /**
   * Exibe um diálogo de alerta
   * @param {Object} options - Opções do diálogo
   * @param {string} options.title - Título do diálogo
   * @param {string} options.message - Mensagem do diálogo
   * @param {string} options.buttonText - Texto do botão
   * @param {string} options.type - Tipo do diálogo (info, warning, danger, success)
   * @returns {Promise<void>} - Promise que resolve quando o diálogo é fechado
   */
  const alert = useCallback(({
    title = 'Aviso',
    message = '',
    buttonText = 'OK',
    type = 'info',
  } = {}) => {
    return new Promise((resolve) => {
      alertDialogRef.current?.show({
        title,
        message,
        buttonText,
        type,
        onClose: () => resolve(),
      });
    });
  }, []);

  /**
   * Funções de conveniência para tipos específicos de confirmação
   */
  const confirmDelete = useCallback((itemName = 'este item') => {
    return confirm({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir ${itemName}?`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      type: 'danger',
    });
  }, [confirm]);

  const confirmAction = useCallback((actionName, itemName = 'este item') => {
    return confirm({
      title: `Confirmar ${actionName}`,
      message: `Tem certeza que deseja ${actionName.toLowerCase()} ${itemName}?`,
      confirmText: actionName,
      cancelText: 'Cancelar',
      type: 'warning',
    });
  }, [confirm]);

  /**
   * Funções de conveniência para tipos específicos de alerta
   */
  const showSuccess = useCallback((message, title = 'Sucesso') => {
    return alert({ title, message, type: 'success' });
  }, [alert]);

  const showError = useCallback((message, title = 'Erro') => {
    return alert({ title, message, type: 'danger' });
  }, [alert]);

  const showWarning = useCallback((message, title = 'Atenção') => {
    return alert({ title, message, type: 'warning' });
  }, [alert]);

  const showInfo = useCallback((message, title = 'Informação') => {
    return alert({ title, message, type: 'info' });
  }, [alert]);

  return {
    // Refs para os componentes
    confirmDialogRef,
    alertDialogRef,
    
    // Funções principais
    confirm,
    alert,
    
    // Funções de conveniência para confirmação
    confirmDelete,
    confirmAction,
    
    // Funções de conveniência para alerta
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
