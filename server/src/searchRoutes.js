const express = require('express');

module.exports = (pool) => {
  const router = express.Router();

  router.get("/autocomplete", async (req, res) => {
    const {search} = req.query;
    if(!search) {
      return res.status(400).json({error: "O parâmetro 'search' é obrigatório"});
    }

    if(search.length <= 2) {
      return res.status(200).json([]);
    }

    try {
      const sanitizedSearch = search.trim().toLowerCase()
      const [rows, fields] = await pool.query("SELECT * FROM searchIndex WHERE MATCH (search_text) AGAINST (? IN BOOLEAN MODE) LIMIT 5;",[sanitizedSearch])
      if(rows.length === 0) {
        return res.status(200).json([]);
      }

      return res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      return res.status(500).json({error: "Erro ao buscar no banco de dados"});
    }



  });
  return router;
}
