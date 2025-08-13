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
const authRoutes = require("./authRoutes")(pool);
const searchRoutes = require("./searchRoutes")(pool);
const passengerRoutes = require("./passengerRoutes")(pool);
const driverRoutes = require("./driverRoutes")(pool);
const stopRoutes = require("./stopRoutes")(pool);
const busRoutes = require("./busRoutes")(pool);
const routeRoutes = require("./routeRoutes")(pool);
const reportsRoutes = require("./reportsRoutes")(pool);
const lastChangeRoutes = require("./lastChangeRoutes")(pool);
const enterpriseUserRoutes = require("./enterpriseUserRoutes")(pool);
//const XXXXRoutes = require("./XXXX")(pool);
//const YYYYRoutes = require("./YYYY")(pool);

// Usando as rotas
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes); // Rota raiz da API
app.use("/api/passengers", passengerRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/lastChanges", lastChangeRoutes);
app.use("/api/enterpriseUsers", enterpriseUserRoutes);
//app.use("/api/XXXX", XXXXRoutes);
//app.use("/api/YYYY", YYYYRoutes);

app.get("/ping", (req, res) => {
    res.json({ message: "Palmeiras!" ,request: req.body});
});


app.get("/", (req,res) => {
    res.json({ message: process.env ,request: req.body});
});

app.listen(PORT, ()=>{
    //console.log(process.env)
    console.log(`Servidor rodando na porta ${PORT}`);
});
