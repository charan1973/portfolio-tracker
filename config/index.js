require("dotenv").config();

const {
  DATABASE_URL,
  PORT
} = process.env;

const envVariables = {
  port: Number(PORT) || 3000,
  db_url: DATABASE_URL
};

module.exports = {
  envVariables
};