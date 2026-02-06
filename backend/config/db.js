const mysql = require('mysql2');
require('dotenv').config();

console.log('db.js started - attempting MySQL connection...');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'brainsimp',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('db.js - Pool created');

const promisePool = pool.promise();

promisePool.query('SELECT 1 + 1 AS result')
    .then(([rows]) => {
        console.log('db.js - Test query successful! Result:', rows[0].result);
    })
    .catch(err => {
        console.error('db.js - Connection/test query FAILED:', err.message);
        console.error('Full error:', err);
    });

module.exports = promisePool;