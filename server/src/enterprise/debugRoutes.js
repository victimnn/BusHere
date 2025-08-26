const express = require('express');
const router = express.Router();

module.exports = (pool) => {
    router.get("/env", (req, res) => {
        res.json({ env: process.env });
    });

    router.get("/setup-db", (req, res) => {
        require('../setupDB.js');
        res.json({ message: "Banco de dados configurado com sucesso!", 
            env: {
                DB_HOST: process.env.DB_HOST,
                DB_PORT: process.env.DB_PORT,
                DB_USER: process.env.DB_USER,
                DB_PASSWORD: process.env.DB_PASSWORD,
                DB_NAME: process.env.DB_NAME
            }
        });
    });

    router.get("/tables/:tableName", async (req, res) => {
        const tableName = req.params.tableName;

        try {
            const [rows] = await pool.query(`SHOW COLUMNS FROM \`${tableName}\``);
            const columns = rows.map(row => row.Field);
            res.json(columns);
        } catch (error) {
            console.error("Erro ao obter colunas da tabela:", error);
            res.status(500).json({ error: error });
        }
    });

    router.get("/tables", async (req, res) => {
        try {
            const [rows] = await pool.query("SHOW TABLES");
            const tableNames = rows.map(row => Object.values(row)[0]); // Extrai os nomes das tabelas
            res.json(tableNames);
        } catch (error) {
            console.error("Erro ao obter tabelas:", error);
            res.status(500).json({ error: error });
        }
    });



    router.get("/health", async (req, res) => {
        //const initialCpuUsage = process.cpuUsage();

        let health = {
            db: "",
            dbPing: 0,
            ram: "",
            //freeDisk: 0,
            //cpu: "",
            uptime: "",
        }

        //verificando banco de dados
        try {
            const start = Date.now();
            await pool.query("SELECT 1");
            health.db = "Conectado ao banco de dados";
            health.dbPing = `${Date.now() - start} ms`;
            console.log('✅ Banco de dados conectado com sucesso. Ping:', health.dbPing);
        } catch (error) {
            health.db = "Erro ao conectar ao banco de dados";
            console.error('❌ Erro na conexão com banco:', error.message);
        }

        //verificando uso de RAM
        const usedRAM = process.memoryUsage().heapUsed / 1024 / 1024;
        health.ram = `${Math.round(usedRAM * 100) / 100} MB`;

        //verificando Disco

        //verificando uso de CPU
        //const endCpuUsage = process.cpuUsage(initialCpuUsage);
        //const totalCpuUsed = endCpuUsage.user + endCpuUsage.system;
        //health.cpu = `${Math.round(totalCpuUsed / 1024)}%`;

        //verificando uptime
        health.uptime = `${Math.round(process.uptime())} segundos`;

        console.log('🔍 Health check completo:', health);
    
        res.json(health);
    });

    // Endpoint simplificado para health check (retorna valores booleanos)
    router.get("/health-simple", async (req, res) => {
        let health = {
            dbConnected: false,
            dbPing: 0,
            serverUptime: 0,
            memoryUsage: 0
        };

        // Verificar banco de dados
        try {
            const start = Date.now();
            await pool.query("SELECT 1");
            health.dbConnected = true;
            health.dbPing = Date.now() - start;
            console.log('✅ Health simple - Banco conectado. Ping:', health.dbPing, 'ms');
        } catch (error) {
            health.dbConnected = false;
            console.error('❌ Health simple - Erro no banco:', error.message);
        }

        // Outras métricas
        health.serverUptime = Math.round(process.uptime());
        health.memoryUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);

        res.json(health);
    });

    router.get("/db-stats", async (req, res) => {
        const stats = {
            connections: 0,
            queries: 0,
            uptime: 0,
            ping: 0
        };

        try {
            const start = Date.now();
            await pool.query("SELECT 1");
            stats.ping = `${Date.now() - start} ms`;
            const [rows] = await pool.query("SHOW STATUS");
            rows.forEach(row => {
                if (row.Variable_name === "Threads_connected") {
                    stats.connections = row.Value;
                } else if (row.Variable_name === "Queries") {
                    stats.queries = row.Value;
                } else if (row.Variable_name === "Uptime") {
                    stats.uptime = row.Value;
                }
            });
        } catch (error) {
            console.error("Erro ao obter estatísticas do banco de dados:", error);
            return res.status(500).json({ error: error });
        }

        res.json(stats);
    });

    router.get("/", (req, res) => {
        res.send(`
<h1> Rotas de Debug </h1>
<ul>
    <li><a href="/debug/env">/debug/env</a></li>
    <li><a href="/debug/setup-db">/debug/setup-db</a></li>
    <li><a href="/debug/tables">/debug/tables</a></li>

    <input type="text" name="tableName" placeholder="Obter Colunas de tabela" />
    <button onClick="
        window.location.href='/debug/tables/' + document.querySelector('input[name=tableName]').value;
    ">Obter colunas</button>


    <li><a href="/debug/health">/debug/health</a></li>
    <li><a href="/debug/db-stats">/debug/db-stats</a></li>
</ul>
        `);
    });



    return router;
};
