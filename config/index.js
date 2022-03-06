require('dotenv').config();

const {
  DATABASE_URL,
  PORT,
  HOST_URL,
  NODE_ENV,
} = process.env;

const envVariables = {
  node_env: NODE_ENV,
  port: Number(PORT) || 3000,
  db_url: DATABASE_URL,
  host_url: HOST_URL,
};

module.exports = {
  envVariables,
};
