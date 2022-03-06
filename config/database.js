const Pool = require('pg-pool');
const { envVariables } = require('.');

const { db_url: dbUrl } = envVariables;

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false },
  max: 5,
});

module.exports = pool;
