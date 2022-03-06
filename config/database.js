const Pool = require('pg-pool');
const { envVariables } = require(".");

const { db } = envVariables;

const pool = new Pool({
    host: db.host,
    database: db.name,
    user: db.user,
    password: db.password,
    port: db.port,
    ssl: { rejectUnauthorized: false },
    max: 5,
});

module.exports = pool;
