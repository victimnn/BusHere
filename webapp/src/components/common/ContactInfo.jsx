import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de informações de contato reutilizável
 * Suporta diferentes tipos de contato com links automáticos
 */
const ContactInfo = ({ 
  contacts, 
  layout = 'grid', 
  className = '',
  showIcons = true 
}) => {
  const getContactLink = (contact) => {
    switch (contact.type) {
      case 'email':
        return `mailto:${contact.value}`;
      case 'phone':
        return `tel:${contact.value}`;
      case 'whatsapp':
        return `https://wa.me/${contact.value.replace(/\D/g, '')}`;
      case 'website':
        return contact.value.startsWith('http') ? contact.value : `https://${contact.value}`;
      default:
        return null;
    }
  };

  const getContactIcon = (type) => {
    const iconMap = {
      email: 'bi-envelope',
      phone: 'bi-telephone',
      whatsapp: 'bi-whatsapp',
      website: 'bi-globe',
      address: 'bi-geo-alt',
      schedule: 'bi-clock'
    };
    
    return iconMap[type] || 'bi-info-circle';
  };

  const renderContactItem = (contact, index) => {
    const link = getContactLink(contact);
    const icon = getContactIcon(contact.type);
    
    const content = (
      <>
        {showIcons && (
          <i className={`${icon} me-2`}></i>
        )}
        <span>{contact.label || contact.value}</span>
      </>
    );

    if (link) {
      return (
        <a 
          key={index}
          href={link} 
          className="text-decoration-none"
          target={contact.type === 'website' ? '_blank' : undefined}
          rel={contact.type === 'website' ? 'noopener noreferrer' : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <span key={index}>
        {content}
      </span>
    );
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'row g-2';
      case 'list':
        return 'd-flex flex-column gap-2';
      case 'inline':
        return 'd-flex flex-wrap gap-3';
      default:
        return 'row g-2';
    }
  };

  const getItemClasses = () => {
    switch (layout) {
      case 'grid':
        return 'col-6';
      case 'list':
        return '';
      case 'inline':
        return '';
      default:
        return 'col-6';
    }
  };

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {contacts.map((contact, index) => (
        <div key={index} className={getItemClasses()}>
          <small className="text-muted d-block">
            {contact.label || contact.type}
          </small>
          <div className="fw-medium">
            {renderContactItem(contact, index)}
          </div>
        </div>
      ))}
    </div>
  );
};

ContactInfo.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.oneOf(['email', 'phone', 'whatsapp', 'website', 'address', 'schedule']).isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string
  })).isRequired,
  layout: PropTypes.oneOf(['grid', 'list', 'inline']),
  className: PropTypes.string,
  showIcons: PropTypes.bool
};

export default ContactInfo;
