import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de célula da tabela
 * @param {Object} props - propriedades do componente
 * @param {*} props.value - valor a ser exibido na célula
 * @param {Object} props.popUpRef - referência para o popup
 * @returns {JSX.Element} componente da célula da tabela
 */
function TableCell({ value, popUpRef }) {
  const showArrOrValueButton = (value) => {
    const popUpContent = () => (
      <div>
        <ul>
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );

    if (popUpRef && Array.isArray(value)) {
      return (
        <button 
          className="btn btn-secondary circle"
          data-circle="true"
          onClick={(e) => {
            e.stopPropagation(); // previne o evento de click na linha
            popUpRef.current.show(popUpContent, {}, 'Valores');
          }}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            padding: '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            lineHeight: '1',
            fontWeight: 'bold',
            minWidth: '32px'
          }}
        >
          ...
        </button>
      );
    } else {
      return value;
    }
  };

  return <td>{showArrOrValueButton(value)}</td>;
}

TableCell.propTypes = {
  value: PropTypes.any,
  popUpRef: PropTypes.object,
};

export default TableCell;
