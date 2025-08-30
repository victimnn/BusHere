import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de cabeçalho de página reutilizável
 * Inclui ícone, título e opcionalmente subtítulo
 */
const PageHeader = ({ icon, title, subtitle, className = '' }) => {
  return (
    <div className={`mb-3 ${className}`}>
      <h4 className="mb-2">
        {icon && (
          <i className={`${icon} me-2 text-primary`}></i>
        )}
        {title}
      </h4>
      {subtitle && (
        <p className="text-muted small mb-0">{subtitle}</p>
      )}
    </div>
  );
};

PageHeader.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  className: PropTypes.string
};

export default PageHeader;
