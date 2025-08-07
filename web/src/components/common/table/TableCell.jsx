import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente de célula da tabela
 * @param {Object} props - propriedades do componente
 * @param {*} props.value - valor a ser exibido na célula
 * @param {Object} props.header - configuração do header da coluna (incluindo formatter)
 * @param {Object} props.popUpRef - referência para o popup
 * @returns {JSX.Element} componente da célula da tabela
 */
function TableCell({ value, header, popUpRef }) {
  console.log("cell", value)
  // Aplica o formatador se disponível
  const displayValue = header?.formatter && value !== null && value !== undefined 
    ? header.formatter(value) 
    : value;

  const showArrOrValueButton = (displayValue) => {
    // Se for um elemento React válido, renderiza diretamente
    if (React.isValidElement(value)) {
      return value;
    }

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
            <p>{displayValue}</p>
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
      return displayValue;
    }
  };

  return <td>{showArrOrValueButton(displayValue)}</td>;
}

TableCell.propTypes = {
  value: PropTypes.any,
  header: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    formatter: PropTypes.func
  }),
  popUpRef: PropTypes.object,
};

export default TableCell;
