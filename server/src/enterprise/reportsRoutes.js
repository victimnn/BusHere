const express = require('express');
const router = express.Router();

// Função que recebe o pool de conexões como parâmetro
module.exports = (pool) => {
  
  // Middleware para autenticação (assumindo que existe)
  const authMiddleware = (req, res, next) => {
    // Implementar verificação de token se necessário
    next();
  };

  // Endpoint para obter estatísticas gerais
  router.get('/stats', authMiddleware, async (req, res) => {
    try {
      // Buscar estatísticas de passageiros
      const [passengersStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_passageiros,
          tp.nome as tipo_nome,
          tp.tipo_passageiro_id
        FROM Passageiros p
        LEFT JOIN TipoPassageiro tp ON p.tipo_passageiro_id = tp.tipo_passageiro_id
        GROUP BY tp.tipo_passageiro_id, tp.nome
      `);

      // Buscar estatísticas de veículos
      const [vehiclesStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_veiculos,
          SUM(capacidade) as capacidade_total,
          sv.nome as status_nome
        FROM Veiculos v
        LEFT JOIN StatusVeiculo sv ON v.status_veiculo_id = sv.status_veiculo_id
        GROUP BY sv.status_veiculo_id, sv.nome
      `);

      // Buscar estatísticas de tipos de veículos
      const [vehicleTypesStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_veiculos,
          SUM(capacidade) as capacidade_total,
          tv.nome as tipo_nome,
          tv.tipo_veiculo_id
        FROM Veiculos v
        LEFT JOIN TipoVeiculo tv ON v.tipo_veiculo_id = tv.tipo_veiculo_id
        GROUP BY tv.tipo_veiculo_id, tv.nome
      `);

      // Buscar estatísticas de rotas
      const [routesStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_rotas,
          SUM(distancia_km) as distancia_total,
          sr.nome as status_nome
        FROM Rotas r
        LEFT JOIN StatusRota sr ON r.status_rota_id = sr.status_rota_id
        GROUP BY sr.status_rota_id, sr.nome
      `);
      
      // Buscar estatísticas de pontos
      const [stopsStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_pontos,
          SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as pontos_ativos,
          SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as pontos_inativos
        FROM Pontos
      `);
      
      // Buscar pontos por cidade
      const [stopsByCity] = await pool.execute(`
        SELECT 
          COALESCE(cidade, 'Não informado') as cidade,
          COUNT(*) as total_pontos
        FROM Pontos
        WHERE cidade IS NOT NULL AND cidade != ''
        GROUP BY cidade
        HAVING cidade != '' AND cidade != 'Não informado'
        ORDER BY total_pontos DESC
        LIMIT 10
      `);
      
      const stats = {
        passengers: {
          total: passengersStats.reduce((sum, stat) => sum + (stat.total_passageiros || 0), 0),
          byType: passengersStats
        },
        vehicles: {
          total: vehiclesStats.reduce((sum, stat) => sum + (stat.total_veiculos || 0), 0),
          totalCapacity: vehiclesStats.reduce((sum, stat) => sum + (parseInt(stat.capacidade_total) || 0), 0),
          byStatus: vehiclesStats,
          byType: vehicleTypesStats
        },
        routes: {
          total: routesStats.reduce((sum, stat) => sum + (stat.total_rotas || 0), 0),
          totalDistance: routesStats.reduce((sum, stat) => sum + (parseFloat(stat.distancia_total) || 0), 0),
          byStatus: routesStats
        },
        stops: {
          ...stopsStats[0],
          byCity: stopsByCity
        }
      };
      
      res.json({ data: stats });
      
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
    }
  });

  // Endpoint para obter dados detalhados para gráficos
  router.get('/charts', authMiddleware, async (req, res) => {
    try {
      // Dados para gráfico de passageiros por cidade
      const [passengersByCity] = await pool.execute(`
        SELECT 
          COALESCE(cidade, 'Não informado') as label,
          COUNT(passageiro_id) as value
        FROM Passageiros
        WHERE cidade IS NOT NULL AND cidade != ''
        GROUP BY cidade
        HAVING cidade != '' AND cidade != 'Não informado'
        ORDER BY value DESC
        LIMIT 10
      `);
      
      // Dados para gráfico de veículos por status
      const [vehiclesByStatus] = await pool.execute(`
        SELECT 
          sv.nome as label,
          COUNT(v.veiculo_id) as value
        FROM StatusVeiculo sv
        LEFT JOIN Veiculos v ON sv.status_veiculo_id = v.status_veiculo_id
        GROUP BY sv.status_veiculo_id, sv.nome
        ORDER BY value DESC
      `);
      
      // Dados para gráfico de rotas por status
      const [routesByStatus] = await pool.execute(`
        SELECT 
          sr.nome as label,
          COUNT(r.rota_id) as value
        FROM StatusRota sr
        LEFT JOIN Rotas r ON sr.status_rota_id = r.status_rota_id
        GROUP BY sr.status_rota_id, sr.nome
        ORDER BY value DESC
      `);
      
      // Dados para gráfico de pontos por cidade
      const [stopsByCity] = await pool.execute(`
        SELECT 
          COALESCE(cidade, 'Não informado') as label,
          COUNT(*) as value
        FROM Pontos
        WHERE cidade IS NOT NULL AND cidade != ''
        GROUP BY label
        HAVING label != '' AND label != 'Não informado'
        ORDER BY value DESC
        LIMIT 10
      `);

      // Dados para gráfico de veículos por tipo
      const [vehiclesByType] = await pool.execute(`
        SELECT 
          tv.nome as label,
          COUNT(v.veiculo_id) as value
        FROM TipoVeiculo tv
        LEFT JOIN Veiculos v ON tv.tipo_veiculo_id = v.tipo_veiculo_id
        GROUP BY tv.tipo_veiculo_id, tv.nome
        ORDER BY value DESC
      `);
      
      const chartData = {
        passengersByCity,
        vehiclesByStatus,
        vehiclesByType,
        routesByStatus,
        stopsByCity
      };
      
      res.json({ data: chartData });
      
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
      res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
    }
  });

  // Endpoint para relatório de utilização
  router.get('/utilization', authMiddleware, async (req, res) => {
    try {
      // Capacidade total vs passageiros totais
      const [utilizationData] = await pool.execute(`
        SELECT 
          (SELECT COUNT(*) FROM passageiros) as total_passengers,
          (SELECT COALESCE(SUM(capacidade), 0) FROM veiculos v 
           LEFT JOIN status_veiculo sv ON v.status_veiculo_id = sv.status_veiculo_id 
           WHERE sv.nome LIKE '%ativo%' OR sv.nome LIKE '%operando%') as total_capacity,
          (SELECT COUNT(*) FROM veiculos v 
           LEFT JOIN status_veiculo sv ON v.status_veiculo_id = sv.status_veiculo_id 
           WHERE sv.nome LIKE '%ativo%' OR sv.nome LIKE '%operando%') as active_vehicles,
          (SELECT COUNT(*) FROM rotas r 
           LEFT JOIN status_rota sr ON r.status_rota_id = sr.status_rota_id 
           WHERE sr.nome LIKE '%ativa%' OR sr.nome LIKE '%operando%') as active_routes
      `);
      
      const utilization = {
        ...utilizationData[0],
        utilization_percentage: utilizationData[0].total_capacity > 0 
          ? ((utilizationData[0].total_passengers / utilizationData[0].total_capacity) * 100).toFixed(2)
          : 0
      };
      
      res.json({ data: utilization });
      
    } catch (error) {
      console.error('Erro ao buscar dados de utilização:', error);
      res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
    }
  });

  // Endpoint temporário apenas para pontos (para debug)
  router.get('/points-only', authMiddleware, async (req, res) => {
    try {
      // Buscar estatísticas de pontos
      const [stopsStats] = await pool.execute(`
        SELECT 
          COUNT(*) as total_pontos,
          SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as pontos_ativos,
          SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as pontos_inativos
        FROM Pontos
      `);
      
      // Buscar pontos por cidade
      const [stopsByCity] = await pool.execute(`
        SELECT 
          COALESCE(cidade, 'Não informado') as cidade,
          COUNT(*) as total_pontos
        FROM Pontos
        WHERE cidade IS NOT NULL AND cidade != ''
        GROUP BY cidade
        HAVING cidade != '' AND cidade != 'Não informado'
        ORDER BY total_pontos DESC
        LIMIT 10
      `);

      const stats = {
        stops: {
          ...stopsStats[0],
          byCity: stopsByCity
        }
      };
      
      res.json({ data: stats });
      
    } catch (error) {
      console.error('Erro ao buscar dados dos pontos:', error);
      res.status(500).json({ error: 'Erro interno do servidor', message: error.message });
    }
  });

  return router;
};
