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
          className="btn btn-secondary p-2 pb-0 pt-0"
          onClick={(e) => {
            e.stopPropagation(); // previne o evento de click na linha
            popUpRef.current.show(popUpContent, {}, 'Valores');
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
