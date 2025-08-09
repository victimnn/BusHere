import { useState, useEffect } from 'react';
import api from '../api/api';

// Hook para carregar opções de ônibus com filtros
export const useBusOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.buses.list(1, 100);
      const allBuses = response.data || [];
      // Filtrar apenas ônibus ativos e em operação
      const filteredBuses = allBuses.filter(bus => 
        (bus.ativo === true || bus.ativo === 1) && // ativo = true
        (bus.status_nome === 'Em Operação') // status = "Em Operação"
      );
      setOptions(filteredBuses);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar ônibus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, error, reload: loadOptions };
};

// Hook para carregar opções de motoristas com filtros
export const useDriverOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.drivers.list(1, 100);
      const allDrivers = response.data || [];
      // Filtrar apenas motoristas ativos e com status "Ativo"
      const filteredDrivers = allDrivers.filter(driver => 
        (driver.ativo === true || driver.ativo === 1) && // ativo = true
        (driver.status_nome === 'Ativo') // status = "Ativo"
      );
      setOptions(filteredDrivers);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar motoristas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  return { options, loading, error, reload: loadOptions };
};

// Hook para formatar opções de ônibus para select
export const useFormattedBusOptions = () => {
  const { options, loading, error, reload } = useBusOptions();
  
  const formattedOptions = options.map(bus => ({
    value: bus.onibus_id,
    label: `${bus.nome} - ${bus.placa} (${bus.marca} ${bus.modelo})`
  }));

  return { options: formattedOptions, loading, error, reload };
};

// Hook para formatar opções de motoristas para select
export const useFormattedDriverOptions = () => {
  const { options, loading, error, reload } = useDriverOptions();
  
  const formattedOptions = options.map(driver => ({
    value: driver.motorista_id,
    label: `${driver.nome} - CNH: ${driver.cnh_numero}`
  }));

  return { options: formattedOptions, loading, error, reload };
};
