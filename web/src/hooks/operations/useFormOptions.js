import { useState, useEffect } from 'react';
import api from '@web/api/api';

// Hook para carregar opções de veículos com filtros
export const useVehicleOptions = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.vehicles.list(1, 100);
      const allVehicles = response.data || [];
      // Filtrar apenas veículos ativos e em operação
      const filteredVehicles = allVehicles.filter(vehicle => 
        (vehicle.ativo === true || vehicle.ativo === 1) && // ativo = true
        (vehicle.status_nome === 'Em Operação') // status = "Em Operação"
      );
      setOptions(filteredVehicles);
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar veículos:', err);
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

// Hook para formatar opções de veículos para select
export const useFormattedVehicleOptions = () => {
  const { options, loading, error, reload } = useVehicleOptions();
  
  const formattedOptions = options.map(vehicle => ({
    value: vehicle.veiculo_id,
    label: `${vehicle.nome} - ${vehicle.placa} (${vehicle.marca} ${vehicle.modelo})`
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
