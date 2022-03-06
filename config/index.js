require("dotenv").config();

const {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  PORT
} = process.env;

const envVariables = {
  port: Number(PORT) || 3000,
  db: {
    host: DB_HOST,
    name: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    driver: "pg"
  }
};

module.exports = {
  envVariables
};