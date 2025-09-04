//Funcionalidade principal
const express = require("express");
const mysql = require("mysql2/promise");

//Coisas do Express
const bodyParser = require("body-parser");
const cors = require("cors");

//Inicialização do dotenv para usar variaveis de ambiente (estão no arquivo .env)
const dotenv = require("dotenv");
dotenv.config();

//Constantes
const PORT = process.env.PORT || 3000

//Inicialização do servidor
const app = express();

//Configuração do servidor
app.use(bodyParser.json()); // Faz o parse do body das requisições para JSON
app.use(cors()); // Permite requisições de outros domínios (CORS)

// Printa no console o IP, método e URL de cada requisição
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;  // Get the IP address
    const method = req.method;
    const url = req.url;
  
    console.log(`${ip} ${method}: ${url}`);
  
    next();
});

// Criação do pool de conexões com o BD
// (pool é um conjunto de conexões que podem ser reutilizadas,
// o que melhora a performance do servidor e não precisa ficar
// criando e destruindo conexões toda hora)
const pool = mysql.createPool({
    // Configurações do banco de dados usando as variaveis de ambiente
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT), 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true, // Espera por conexões evitando criar novas
    connectionLimit: 10, // Limite de conexões simultâneas
    queueLimit: 0 // Sem limite de filas de espera
});

// Importando as rotas
// Empresas
const E_authRoutes = require("./enterprise/authRoutes.js")(pool);
const E_searchRoutes = require("./enterprise/searchRoutes.js")(pool);
const E_passengerRoutes = require("./enterprise/passengerRoutes.js")(pool);
const E_driverRoutes = require("./enterprise/driverRoutes.js")(pool);
const E_stopRoutes = require("./enterprise/stopRoutes.js")(pool);
const E_busRoutes = require("./enterprise/busRoutes.js")(pool);
const E_routeRoutes = require("./enterprise/routeRoutes.js")(pool);
const E_reportsRoutes = require("./enterprise/reportsRoutes.js")(pool);
const E_lastChangeRoutes = require("./enterprise/lastChangeRoutes.js")(pool);
const E_enterpriseUserRoutes = require("./enterprise/enterpriseUserRoutes.js")(pool);
const E_debugRoutes = require("./enterprise/debugRoutes.js")(pool);
const E_databaseRoutes = require("./enterprise/databaseRoutes.js")(pool)

// Passageiros
const P_authRoutes = require("./passenger/authRoutes.js")(pool);




// Usando as rotas
app.use("/api/enterprise/auth", E_authRoutes);
app.use("/api/enterprise", E_searchRoutes); // Rota raiz da API
app.use("/api/enterprise/passengers", E_passengerRoutes);
app.use("/api/enterprise/drivers", E_driverRoutes);
app.use("/api/enterprise/stops", E_stopRoutes);
app.use("/api/enterprise/buses", E_busRoutes);
app.use("/api/enterprise/routes", E_routeRoutes);
app.use("/api/enterprise/reports", E_reportsRoutes);
app.use("/api/enterprise/lastChanges", E_lastChangeRoutes);
app.use("/api/enterprise/enterpriseUsers", E_enterpriseUserRoutes);
app.use("/api/enterprise/debug", E_debugRoutes);
app.use("/api/enterprise/database", E_databaseRoutes);

app.use("/api/passenger/auth", P_authRoutes);

//app.use("/api/XXXX", XXXXRoutes);
//app.use("/api/YYYY", YYYYRoutes);

app.get("/ping", (req, res) => {
    res.json({ message: "Palmeiras!" ,request: req.body});
});

app.get('/', (req, res) => {
    res.json({ message: "Bem-vindo à API!" });
});

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
});
