import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente reutilizável para botões de ação em tabelas
 * @param {Object} props - propriedades do componente
 * @param {string} props.variant - variante do botão (primary, secondary, success, etc.)
 * @param {string} props.size - tamanho do botão (sm, md, lg)
 * @param {string} props.icon - classe do ícone Bootstrap
 * @param {string} props.text - texto do botão
 * @param {Function} props.onClick - função chamada quando o botão é clicado
 * @param {string} props.title - título do botão (tooltip)
 * @param {boolean} props.disabled - se o botão está desabilitado
 * @param {string} props.className - classes CSS adicionais
 * @returns {JSX.Element} componente do botão de ação
 */
function TableActionButton({
  variant = 'outline-primary',
  size = 'sm',
  icon,
  text,
  onClick,
  title,
  disabled = false,
  className = '',
}) {
  const handleClick = (e) => {
    e.stopPropagation(); // Evita que o clique na linha seja acionado
    if (onClick && !disabled) {
      onClick(e);
    }
  };

  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      title={title}
      disabled={disabled}
    >
      {icon && <i className={`${icon} ${text ? 'me-1' : ''}`}></i>}
      {text}
    </button>
  );
}

TableActionButton.propTypes = {
  variant: PropTypes.string,
  size: PropTypes.string,
  icon: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

export default TableActionButton;
