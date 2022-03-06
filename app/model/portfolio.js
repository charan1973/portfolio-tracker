const pool = require('../../config/database');

const PORTFOLIO = {};

PORTFOLIO.SQLGetPortfolio = ({ portfolioId }) => {
  const query = `
      SELECT id, name
      FROM portfolio
      WHERE id = $1;
    `;
  const values = [portfolioId];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, res) => {
      if (err) {
        return reject(err);
      }
      const { rows: portfolio } = res;
      return resolve(portfolio[0]);
    });
  });
};

module.exports = PORTFOLIO;
