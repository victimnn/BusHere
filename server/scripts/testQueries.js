const mysql = require('mysql2/promise');

async function testQueries() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Ajuste se necessário
    database: 'tcc'
  });

  try {
    console.log('🔍 Testando queries individualmente...\n');

    // Testar passageiros
    const [passengers] = await connection.execute(`
      SELECT 
        COUNT(*) as total_passageiros,
        tp.nome as tipo_nome,
        tp.tipo_passageiro_id
      FROM Passageiros p
      LEFT JOIN TipoPassageiro tp ON p.tipo_passageiro_id = tp.tipo_passageiro_id
      GROUP BY tp.tipo_passageiro_id, tp.nome
    `);
    console.log('✅ Passageiros:', passengers);

    // Testar ônibus
    const [buses] = await connection.execute(`
      SELECT 
        COUNT(*) as total_onibus,
        SUM(capacidade) as capacidade_total,
        so.nome as status_nome
      FROM Onibus o
      LEFT JOIN StatusOnibus so ON o.status_onibus_id = so.status_onibus_id
      GROUP BY so.status_onibus_id, so.nome
    `);
    console.log('✅ Ônibus:', buses);

    // Testar rotas
    const [routes] = await connection.execute(`
      SELECT 
        COUNT(*) as total_rotas,
        SUM(distancia_km) as distancia_total,
        sr.nome as status_nome
      FROM Rotas r
      LEFT JOIN StatusRota sr ON r.status_rota_id = sr.status_rota_id
      GROUP BY sr.status_rota_id, sr.nome
    `);
    console.log('✅ Rotas:', routes);

    // Testar pontos
    const [stops] = await connection.execute(`
      SELECT 
        COUNT(*) as total_pontos,
        SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as pontos_ativos,
        SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as pontos_inativos
      FROM Pontos
    `);
    console.log('✅ Pontos:', stops);

    // Testar se as tabelas têm dados
    const [passengersCount] = await connection.execute('SELECT COUNT(*) as count FROM Passageiros');
    const [busesCount] = await connection.execute('SELECT COUNT(*) as count FROM Onibus');
    const [routesCount] = await connection.execute('SELECT COUNT(*) as count FROM Rotas');
    console.log('\n📊 Contagens diretas:');
    console.log('Passageiros:', passengersCount[0].count);
    console.log('Ônibus:', busesCount[0].count);
    console.log('Rotas:', routesCount[0].count);
    
  } catch (error) {
    console.error('❌ Erro ao testar queries:', error.message);
  } finally {
    await connection.end();
  }
}

testQueries();
