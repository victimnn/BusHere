const express = require('express');


module.exports = (pool) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const {limit = 50} = req.query;
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM LogMudancas ORDER BY timestamp DESC LIMIT ?',
                [limit]
            );
            return res.json(rows);
        } catch (error) {
            console.error('Error fetching last changes:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    });


    return router
}

