import React, { useState, forwardRef, useImperativeHandle, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente PopUp modular e customizável para exibir modais
 * Suporta customização completa de estilos, temas e comportamento
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.variant - Variante do modal ('default', 'rounded', 'minimal', 'card')
 * @param {string} props.size - Tamanho do modal ('sm', 'md', 'lg', 'xl', 'fullscreen')
 * @param {string} props.theme - Tema do modal ('light', 'dark', 'primary', 'success', 'warning', 'danger')
 * @param {number} props.borderRadius - Raio da borda em pixels
 * @param {string} props.overlayColor - Cor do overlay de fundo
 * @param {number} props.overlayOpacity - Opacidade do overlay (0-1)
 * @param {boolean} props.showCloseButton - Se deve mostrar botão de fechar
 * @param {boolean} props.closeOnOverlayClick - Se deve fechar ao clicar no overlay
 * @param {boolean} props.closeOnEscape - Se deve fechar ao pressionar ESC
 * @param {string} props.animation - Tipo de animação ('fade', 'slide', 'zoom', 'none')
 * @param {number} props.zIndex - Z-index do modal
 * @param {Object} props.customStyles - Estilos customizados para o modal
 * @param {string} props.headerClassName - Classes CSS customizadas para o cabeçalho
 * @param {string} props.bodyClassName - Classes CSS customizadas para o corpo
 * @param {string} props.contentClassName - Classes CSS customizadas para o conteúdo
 */
const PopUpComponent = memo(forwardRef(({
  variant = 'default',
  size = 'md',
  theme = 'light',
  borderRadius = null,
  overlayColor = null,
  overlayOpacity = 0.5,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  animation = 'fade',
  zIndex = 1050,
  customStyles = {},
  headerClassName = '',
  bodyClassName = '',
  contentClassName = '',
  ...props
}, ref) => {
  /**
   * Estado do modal contendo:
   * - isVisible: controla se o modal está visível
   * - ContentComponent: componente a ser renderizado dentro do modal
   * - componentProps: props a serem passadas para o ContentComponent
   * - title: título do modal
   * - modalProps: propriedades específicas do modal atual
   */
  const [modalState, setModalState] = useState({
    isVisible: false,
    ContentComponent: null,
    componentProps: {},
    title: '',
    modalProps: {}
  });

  /**
   * Função para ocultar o modal
   */
  const hide = useCallback(() => {
    setModalState({
      isVisible: false,
      ContentComponent: null,
      componentProps: {},
      title: '',
      modalProps: {}
    });
    document.body.classList.remove('modal-open');
  }, []);

  /**
   * Função para exibir o modal
   * @param {Object} params - Parâmetros do modal
   * @param {Function} params.content - Função que retorna o conteúdo do modal
   * @param {Object} params.props - Props a serem passadas para o conteúdo
   * @param {string} params.title - Título do modal
   * @param {Object} params.modalProps - Propriedades específicas do modal (sobrescreve props padrão)
   */
  const show = useCallback(({ content, props: contentProps = {}, title = '', modalProps = {} }) => {
    let ContentComponent;
    if (typeof content === 'function') {
      ContentComponent = () => content({ close: hide, ...contentProps });
    } else if (typeof content === 'string') {
      ContentComponent = () => <span>{content}</span>;
    } else {
      ContentComponent = () => content;
    }
    
    setModalState({
      isVisible: true,
      ContentComponent,
      componentProps: contentProps,
      title,
      modalProps: { ...modalProps }
    });
    document.body.classList.add('modal-open');
  }, [hide]);

  /**
   * Handler para tecla ESC
   */
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      hide();
    }
  }, [hide, closeOnEscape]);

  /**
   * Configurações de tema
   */
  const getThemeConfig = (themeName) => {
    const themes = {
      light: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        borderColor: '#dee2e6',
        headerBg: '#f8f9fa',
        closeButtonColor: '#6c757d'
      },
      dark: {
        backgroundColor: '#343a40',
        textColor: '#ffffff',
        borderColor: '#495057',
        headerBg: '#212529',
        closeButtonColor: '#adb5bd'
      },
      primary: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        borderColor: '#007bff',
        headerBg: '#007bff',
        closeButtonColor: '#ffffff'
      },
      success: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        borderColor: '#28a745',
        headerBg: '#28a745',
        closeButtonColor: '#ffffff'
      },
      warning: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        borderColor: '#ffc107',
        headerBg: '#ffc107',
        closeButtonColor: '#212529'
      },
      danger: {
        backgroundColor: '#ffffff',
        textColor: '#212529',
        borderColor: '#dc3545',
        headerBg: '#dc3545',
        closeButtonColor: '#ffffff'
      }
    };
    return themes[themeName] || themes.light;
  };

  /**
   * Configurações de tamanho
   */
  const getSizeConfig = (sizeName) => {
    const sizes = {
      sm: { maxWidth: '300px' },
      md: { maxWidth: '500px' },
      lg: { maxWidth: '800px' },
      xl: { maxWidth: '1140px' },
      fullscreen: { maxWidth: '100vw', maxHeight: '100vh' }
    };
    return sizes[sizeName] || sizes.md;
  };

  /**
   * Configurações de variante
   */
  const getVariantConfig = (variantName) => {
    const variants = {
      default: { borderRadius: '0.375rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' },
      rounded: { borderRadius: '1rem', boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)' },
      minimal: { borderRadius: '0.25rem', boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)' },
      card: { borderRadius: '1.5rem', boxShadow: '0 1rem 3rem rgba(0, 0, 0, 0.175)' }
    };
    return variants[variantName] || variants.default;
  };

  /**
   * Configurações de animação
   */
  const getAnimationConfig = (animationName) => {
    const animations = {
      fade: { 
        overlayClass: 'modal-fade',
        dialogClass: 'modal-dialog-fade'
      },
      slide: { 
        overlayClass: 'modal-slide',
        dialogClass: 'modal-dialog-slide'
      },
      zoom: { 
        overlayClass: 'modal-zoom',
        dialogClass: 'modal-dialog-zoom'
      },
      none: { 
        overlayClass: '',
        dialogClass: ''
      }
    };
    return animations[animationName] || animations.fade;
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }), [show, hide]);

  // Obter configurações atuais (props do modal sobrescrevem props padrão)
  const currentModalProps = { ...modalState.modalProps };
  const currentTheme = currentModalProps.theme || theme;
  const currentSize = currentModalProps.size || size;
  const currentVariant = currentModalProps.variant || variant;
  const currentAnimation = currentModalProps.animation || animation;
  const currentBorderRadius = currentModalProps.borderRadius || borderRadius;
  const currentOverlayColor = currentModalProps.overlayColor || overlayColor;
  const currentOverlayOpacity = currentModalProps.overlayOpacity || overlayOpacity;
  const currentShowCloseButton = currentModalProps.showCloseButton !== undefined ? currentModalProps.showCloseButton : showCloseButton;
  const currentCloseOnOverlayClick = currentModalProps.closeOnOverlayClick !== undefined ? currentModalProps.closeOnOverlayClick : closeOnOverlayClick;

  const themeConfig = getThemeConfig(currentTheme);
  const sizeConfig = getSizeConfig(currentSize);
  const variantConfig = getVariantConfig(currentVariant);
  const animationConfig = getAnimationConfig(currentAnimation);

  // Estilos dinâmicos
  const overlayStyle = {
    display: 'block',
    backgroundColor: currentOverlayColor || `rgba(0, 0, 0, ${currentOverlayOpacity})`,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: currentModalProps.zIndex || zIndex,
    overflowX: 'hidden',
    overflowY: 'auto',
    outline: 0,
    ...customStyles.overlay
  };

  const dialogStyle = {
    maxHeight: '90vh',
    overflow: 'hidden',
    maxWidth: sizeConfig.maxWidth,
    ...customStyles.dialog
  };

  const contentStyle = {
    backgroundColor: themeConfig.backgroundColor,
    color: themeConfig.textColor,
    border: `1px solid ${themeConfig.borderColor}`,
    borderRadius: currentBorderRadius || variantConfig.borderRadius,
    boxShadow: variantConfig.boxShadow,
    ...customStyles.content
  };

  const headerStyle = {
    backgroundColor: themeConfig.headerBg,
    color: currentTheme === 'primary' || currentTheme === 'success' || currentTheme === 'warning' || currentTheme === 'danger' ? '#ffffff' : themeConfig.textColor,
    borderBottom: `1px solid ${themeConfig.borderColor}`,
    ...customStyles.header
  };

  // Renderiza o modal se estiver visível
  return (
    modalState.isVisible && (
      <div 
        className={`modal fade show ${animationConfig.overlayClass}`}
        style={overlayStyle}
        onClick={currentCloseOnOverlayClick ? hide : undefined}
        onKeyDown={handleKeyDown}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div 
          className={`modal-dialog modal-dialog-centered ${animationConfig.dialogClass}`}
          onClick={(e) => e.stopPropagation()}
          style={dialogStyle}
        >
          <div className="modal-content" style={contentStyle}>
            {/* Cabeçalho do modal */}
            {modalState.title && (
              <div 
                className={`modal-header ${headerClassName}`}
                style={headerStyle}
              >
                <h5 className="modal-title">{modalState.title}</h5>
                {currentShowCloseButton && (
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={hide}
                    aria-label="Fechar"
                    style={{ 
                      filter: currentTheme === 'dark' ? 'invert(1)' : 'none',
                      ...customStyles.closeButton
                    }}
                  ></button>
                )}
              </div>
            )}
            
            {/* Corpo do modal */}
            <div 
              className={`modal-body ${bodyClassName}`}
              style={customStyles.body}
            >
              {modalState.ContentComponent && (
                <modalState.ContentComponent 
                  {...modalState.componentProps}
                  className={contentClassName}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
}));

PopUpComponent.propTypes = {
  variant: PropTypes.oneOf(['default', 'rounded', 'minimal', 'card']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'fullscreen']),
  theme: PropTypes.oneOf(['light', 'dark', 'primary', 'success', 'warning', 'danger']),
  borderRadius: PropTypes.number,
  overlayColor: PropTypes.string,
  overlayOpacity: PropTypes.number,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  animation: PropTypes.oneOf(['fade', 'slide', 'zoom', 'none']),
  zIndex: PropTypes.number,
  customStyles: PropTypes.shape({
    overlay: PropTypes.object,
    dialog: PropTypes.object,
    content: PropTypes.object,
    header: PropTypes.object,
    body: PropTypes.object,
    closeButton: PropTypes.object
  }),
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
  contentClassName: PropTypes.string
};

PopUpComponent.defaultProps = {
  variant: 'default',
  size: 'md',
  theme: 'light',
  borderRadius: null,
  overlayColor: null,
  overlayOpacity: 0.5,
  showCloseButton: true,
  closeOnOverlayClick: true,
  closeOnEscape: true,
  animation: 'fade',
  zIndex: 1050,
  customStyles: {},
  headerClassName: '',
  bodyClassName: '',
  contentClassName: ''
};

export default PopUpComponent;
