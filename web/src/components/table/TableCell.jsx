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
        <ul className="p-0">
          {/*Array*/Array.isArray(value) && (
            value.map((item, index) => (
              <p key={index}>{item}</p>
            ))
          )}
          {/*Objeto*/typeof value === 'object' && !Array.isArray(value) && (
            Object.entries(value).map(([key, val], index) => (
              <p key={index}>
                <strong>{key}:</strong> {val}
              </p>
            ))
          )}
          {/*simples*/typeof value !== 'object' && !Array.isArray(value) && (
            <p>{value}</p>
          )}
        </ul>
      </div>
    );

    if (popUpRef && (Array.isArray(value) || typeof value === 'object')) {
      return (
        <button 
          className="btn btn-secondary ps-2 pe-2 pt-0 pb-0"
          data-circle="true"
          onClick={(e) => {
            e.stopPropagation(); // previne o evento de click na linha
            popUpRef.current.show({ content: popUpContent, title: 'Valores' });
          }}
          data-circle="false"
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
