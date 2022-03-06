const router = require("express").Router();
const { getPortfolio, getReturns } = require("../../controller/portfolio.controller");


router.get("/:portfolio_id", getPortfolio);
router.get("/returns/:portfolio_id", getReturns);

module.exports = router;
