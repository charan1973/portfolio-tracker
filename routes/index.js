const express = require('express');
const router = express.Router();

const tradeRoutes = require("./api/trade.routes");
const portfolioRoutes = require("./api/portfolio.routes");

router.use('/portfolio', portfolioRoutes);
router.use('/trade', tradeRoutes);

module.exports = router;
