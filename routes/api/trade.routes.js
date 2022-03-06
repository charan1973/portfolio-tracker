const {
  createTrade,
  removeTrade,
  getTrades,
  updateTrade
} = require("../../controller/trade.controller");

const router = require("express").Router();

router.post("/", createTrade);

router.get("/:portfolio_id", getTrades);

router.put("/:portfolio_id/:trade_id", updateTrade);

router.delete("/:portfolio_id/:trade_id", removeTrade);

module.exports = router;