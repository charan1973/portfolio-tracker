const router = require('express').Router();

const getPortfolio = require('../../controller/portfolio/getPortfolio.controller');
const getReturns = require('../../controller/portfolio/getReturns.controller');

router.get('/:portfolio_id', getPortfolio);

router.get('/returns/:portfolio_id', getReturns);

module.exports = router;
