const Pool = require('pg-pool');
const { envVariables } = require(".");

const { db_url } = envVariables;

const pool = new Pool({
    connectionString: db_url,
    ssl: { rejectUnauthorized: false },
    max: 5,
});

module.exports = pool;
