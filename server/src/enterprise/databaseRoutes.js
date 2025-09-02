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

    try {
      //Obter a key e o valor de cada parte da informação
      const dataKeys = Object.keys(data);
      const dataValues = Object.values(data);

      //Inserir os valores
      dataKeys.forEach((key, index) => { //Para cada tabela
        const values = dataValues[index];
        if(values.length === 0) return; //Se não tiver valores, não faz nada
        values.forEach((row) => {
          try {
            pool.query(`INSERT INTO ?? SET ?`, [key, row]);
            console.log("Dados inseridos com sucesso:", { table: key, row });
          } catch(error){
            console.error("Erro ao inserir dados:");
          }
        });
      });

    } catch (error) {
      console.error("Erro ao importar dados:", error);
      res.status(500).json({ error: "Erro ao importar dados: " + error.message });
    }

  });


  return router;
}

