const express = require('express');
//const { validateCPF } = require("./helpers")

module.exports = (pool) => {
  const router = express.Router();

  router.get("autocomplete", async (req, res) => {
    const {search} = req.query;
    if(!search) {
      return res.status(400).json({error: "O parâmetro 'search' é obrigatório"});
    }


  });
  return router;
}
