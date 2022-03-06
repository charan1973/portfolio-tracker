const pool = require("../config/database");

const SECURITY = {};

SECURITY.SQLGetAllSecurities = ({ portfolioId }) => {
  const query = `
    SELECT ticker_symbol, average_buy_price, shares
    FROM securities
    WHERE portfolio_id = $1;
  `;

  const values = [portfolioId];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
        if (err) {
            return reject(err);
        }
        const { rows: securities } = res;
        return resolve(securities);
    })
  });
};

module.exports = SECURITY;
