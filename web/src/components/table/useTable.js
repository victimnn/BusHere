import { useState, useMemo, useEffect } from 'react';

/**
 * Hook personalizado para lógica da tabela
 * @param {Array} data - dados da tabela
 * @param {number} itemsPerPage - itens por página
 * @param {boolean} searchable - se a tabela é pesquisável
 * @returns {Object} estado e funções da tabela
 */
export function useTable(data, itemsPerPage = 10, searchable = true) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // volta pra primeira page quando os dados ou o termo de pesquisa mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [data, searchTerm]);

  // alterna a direção quando a mesma coluna é clicada novamente
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // usa useMemo para evitar cálculos desnecessários
  const processedData = useMemo(() => {
    let filteredData = [...data];

    // filtra dados com base no termo de pesquisa
    if (searchable && searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }

    // ordena dados com base na configuração de ordenação
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        // Verifica se os valores são números
        if (!isNaN(a[sortConfig.key]) && !isNaN(b[sortConfig.key])) {
          if (sortConfig.direction === 'asc') {
            return Number(a[sortConfig.key]) - Number(b[sortConfig.key]);
          } else {
            return Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
          }
        }
        
        // Para datas (assume formato ISO)
        if (Date.parse(a[sortConfig.key]) && Date.parse(b[sortConfig.key])) {
          if (sortConfig.direction === 'asc') {
            return new Date(a[sortConfig.key]) - new Date(b[sortConfig.key]);
          } else {
            return new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
          }
        }
        
        // Para strings
        const aValue = String(a[sortConfig.key]).toLowerCase();
        const bValue = String(b[sortConfig.key]).toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filteredData;
  }, [data, sortConfig, searchTerm, searchable]);

  // calcula o número total de páginas e a pagina atual
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    sortConfig,
    currentPage,
    searchTerm,
    totalPages,
    paginatedData,
    requestSort,
    setCurrentPage,
    setSearchTerm,
  };
}
