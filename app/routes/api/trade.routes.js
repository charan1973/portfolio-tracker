const router = require('express').Router();

const createTrade = require('../../controller/trade/createTrade.controller');
const getTrades = require('../../controller/trade/getTrades.controller');
const updateTrade = require('../../controller/trade/updateTrade.controller');
const removeTrade = require('../../controller/trade/removeTrade.controller');

router.post('/', createTrade);

router.get('/:portfolio_id', getTrades);

router.put('/:portfolio_id/:trade_id', updateTrade);

router.delete('/:portfolio_id/:trade_id', removeTrade);

module.exports = router;
