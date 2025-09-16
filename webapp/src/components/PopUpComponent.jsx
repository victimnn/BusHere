import React, { useState, forwardRef, useImperativeHandle, useCallback, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from './common/feedback/Dialog';

/**
 * Estilos para o overlay do modal
 * Define um overlay que ocupa toda a tela com fundo semi-transparente
 */
const styles = {
  fullScreenOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro semi-transparente
    position: 'fixed', // Posição fixa para cobrir toda a tela
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1040, // Z-index alto para ficar acima de outros elementos
    overflowX: 'hidden',
    overflowY: 'auto', // Permite scroll vertical se necessário
    outline: 0,
  },
};

/**
 * Componente PopUp reutilizável para exibir modais
 * Utiliza forwardRef para permitir acesso às funções show/hide por componentes pais
 * Implementa memo para otimização de performance
 */
const PopUpComponent = memo(forwardRef((props, ref) => {
  /**
   * Estado do modal contendo:
   * - isVisible: controla se o modal está visível
   * - ContentComponent: componente a ser renderizado dentro do modal
   * - componentProps: props a serem passadas para o ContentComponent
   * - title: título do modal
   */
  const [modalState, setModalState] = useState({
    isVisible: false,
    ContentComponent: null,
    componentProps: {},
    title: '',
  });

  /**
   * Função para ocultar o modal
   * Reseta o estado para valores padrão e remove a classe modal-open do body
   */
    // Fecha o PopUp sem confirmação
    const hide = useCallback(() => {
      setModalState({
        isVisible: false,
        ContentComponent: null,
        componentProps: {},
        title: '',
      });
      document.body.classList.remove('modal-open');
    }, []);

    // Fecha o PopUp com confirmação (usado no overlay)
    const hideWithConfirm = useCallback(() => {
      setModalState({
        isVisible: false,
        ContentComponent: null,
        componentProps: {},
        title: '',
      });
      document.body.classList.remove('modal-open');
    }, []);

  /**
   * Função para exibir o modal
   * @param {Object} params - Parâmetros do modal
   * @param {Function} params.content - Função que retorna o conteúdo do modal
   * @param {Object} params.props - Props a serem passadas para o conteúdo
   * @param {string} params.title - Título do modal
   */
  const show = useCallback(({ content, props = {}, title = '' }) => {
    let ContentComponent;
    if (typeof content === 'function') {
      ContentComponent = () => content({ close: hide, ...props });
    } else if (typeof content === 'string') {
      ContentComponent = () => <span>{content}</span>;
    } else {
      ContentComponent = () => content;
    }
    setModalState({
      isVisible: true,
      ContentComponent,
      componentProps: props,
      title,
    });
    document.body.classList.add('modal-open');
  }, [hide]);

  useImperativeHandle(ref, () => ({
    show,
    hide,
    hideWithConfirm,
  }), [show, hide, hideWithConfirm]);

  // Renderiza o modal se estiver visível
  return (
    modalState.isVisible && (
      <div style={styles.fullScreenOverlay} onClick={hideWithConfirm}>
        <Dialog
          open={modalState.isVisible}
          onClose={hide}
          title={modalState.title}
        >
          <div onClick={e => e.stopPropagation()}>
            {modalState.ContentComponent && <modalState.ContentComponent {...modalState.componentProps} />}
          </div>
        </Dialog>
      </div>
    )
  );
}));

PopUpComponent.propTypes = {
  // ... defina as propTypes se necessário
};

export default PopUpComponent;
