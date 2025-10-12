import { useCallback } from 'react';

/**
 * Hook customizado para gerenciar animações de ícones em inputs
 * 
 * @returns {Object} Objeto com handlers de foco e blur
 * @property {Function} handleFocus - Handler para evento de foco
 * @property {Function} handleBlur - Handler para evento de blur
 */
const useInputIconAnimation = () => {
  const handleFocus = useCallback((e, customOnFocus) => {
    const iconSpan = e.currentTarget.previousElementSibling;
    if (iconSpan && iconSpan.classList.contains('input-group-text')) {
      iconSpan.style.backgroundColor = '#e7f5ff';
      const iconElement = iconSpan.querySelector('i');
      if (iconElement) {
        iconElement.style.color = 'var(--bs-primary)';
      }
    }
    if (customOnFocus) customOnFocus(e);
  }, []);

  const handleBlur = useCallback((e, customOnBlur) => {
    const iconSpan = e.currentTarget.previousElementSibling;
    if (iconSpan && iconSpan.classList.contains('input-group-text')) {
      iconSpan.style.backgroundColor = '#f8f9fa';
      const iconElement = iconSpan.querySelector('i');
      if (iconElement) {
        iconElement.style.color = '#6c757d';
      }
    }
    if (customOnBlur) customOnBlur(e);
  }, []);

  return { handleFocus, handleBlur };
};

export default useInputIconAnimation;
