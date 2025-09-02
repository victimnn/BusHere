const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  // Rota para obter uma lista de onibus com paginação e filtros opcionais
  router.post("/sql", async (req, res) => {
    const { query } = req.body;

    try {
      const [results] = await pool.query(query);
      res.json(results);
    } catch (error) {
      console.error("Erro ao executar a consulta SQL:", error);
      res.status(500).json({ error: "Erro ao executar a consulta SQL" });
    }
  });

  router.get("/export", async (req, res) => {
    const [tableResult] = await pool.query("SHOW TABLES");
    const tables = tableResult.map((row) => Object.values(row)[0]);
    let output = {}

    for (const table of tables) {
      const [data] = await pool.query(`SELECT * FROM ??`, [table]);
      output[table] = data;
    }

    res.json(output);
  });

  router.post("/import", async (req, res) => {
    const { data } = req.body;
    const ignored = {};

    try {
      const dataKeys = Object.keys(data);
      const dataValues = Object.values(data);

      for (let i = 0; i < dataKeys.length; i++) {
        const key = dataKeys[i];
        const values = dataValues[i];
        ignored[key] = [];

        if (values.length === 0) continue;

        for (const row of values) {
          try {
            await pool.query(`INSERT INTO ?? SET ?`, [key, row]);
            console.log("Dados inseridos com sucesso:", { table: key, row });
          } catch (error) {
            console.error("Erro ao inserir dados:", error);
            ignored[key].push({ row, error: error.message });
          }
        }
      }

      res.json({ ignored });
    } catch (error) {
      console.error("Erro ao importar dados:", error);
      res.status(500).json({ error: "Erro ao importar dados: " + error.message });
    }
  });


  return router;
}

