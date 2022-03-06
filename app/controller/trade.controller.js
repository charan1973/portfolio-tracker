const createTrade = require('./trade/createTrade.controller');
const getTrades = require('./trade/getTrade.controller');
const removeTrade = require('./trade/removeTrade.controller');
const updateTrade = require('./trade/updateTrade.controller');

module.exports = {
  createTrade,
  getTrades,
  removeTrade,
  updateTrade,
};
