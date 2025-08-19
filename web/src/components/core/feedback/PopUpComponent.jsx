import React, { useState, forwardRef, useImperativeHandle, useCallback, memo, useRef } from 'react';
import PropTypes from 'prop-types';
import Dialog from '../../common/feedback/Dialog';

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
              // Usa o Dialog unificado em vez de window.confirm
        if (dialogRef.current) {
            dialogRef.current.showConfirm({
          title: 'Confirmar Saída',
          message: 'Tem certeza que deseja sair do pop-up?',
          confirmText: 'Sair',
          cancelText: 'Cancelar',
          type: 'warning',
          onConfirm: hide,
          onCancel: () => {}
        });
      }
    }, [hide]);

  /**
   * Função para exibir o modal
   * @param {Object} params - Parâmetros do modal
   * @param {Function} params.content - Função que retorna o conteúdo do modal
   * @param {Object} params.props - Props a serem passadas para o conteúdo
   * @param {string} params.title - Título do modal
   */
  const show = useCallback(({ content, props = {}, title = '' }) => {
    setModalState({
      isVisible: true,
      // Cria um componente que renderiza o conteúdo com a função close
      ContentComponent: () => content({ close: hide, ...props }),
      componentProps: props,
      title,
    });
    document.body.classList.add('modal-open');
  }, [hide]);

  /**
   * Expõe as funções show e hide para componentes pais através da ref
   */
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }), [show, hide]);

      // Ref para o Dialog unificado
    const dialogRef = useRef();

  // Desestrutura o estado do modal
  const { isVisible, ContentComponent, componentProps, title } = modalState;

  // Se o modal não estiver visível, não renderiza nada
  if (!isVisible) {
    return null;
  }

  return (
    // Overlay principal do modal com classes Bootstrap
    <div
      className={`modal fade ${isVisible ? 'show' : ''}`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myBootstrapModalLabel"
      aria-hidden={!isVisible}
      style={{
        display: isVisible ? 'block' : 'none',
        ...styles.fullScreenOverlay,
      }}
      onClick={hideWithConfirm} // Fecha o modal ao clicar no overlay, com confirmação
    >
      {/* Container do modal - previne o fechamento ao clicar dentro */}
      <div className="modal-dialog modal-dialog-centered d-flex justify-content-center" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content w-auto">
          {/* Cabeçalho do modal */}
          <div className="modal-header">
            {/* Título opcional */}
            {title && <h5 className="modal-title" id="myBootstrapModalLabel">{title}</h5>}
            {/* Botão de fechar */}
            <button type="button" className="btn-close" aria-label="Close" onClick={hide}></button>
          </div>
          {/* Corpo do modal onde o conteúdo é renderizado */}
          <div className="modal-body">
            {ContentComponent && <ContentComponent {...componentProps} />}
          </div>
        </div>
      </div>
      
              {/* Dialog unificado para confirmações */}
        <Dialog ref={dialogRef} />
    </div>
  );
}));

// Define o nome do componente para debugging
PopUpComponent.displayName = 'PopUpComponent';

// Define os tipos de propriedades esperadas pelo componente
PopUpComponent.propTypes = {
  // Atualmente não há props diretas, mas pode ser expandido conforme necessário
  // As props são passadas através das funções show() expostas pela ref
};

export default PopUpComponent;