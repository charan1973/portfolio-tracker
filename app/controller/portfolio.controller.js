const { getCurrentPrice } = require("../../helpers");
const { SQLGetPortfolio } = require("../model/portfolio");
const { SQLGetAllSecurities } = require("../model/securities");

const getPortfolio = async (req, res) => {
  // #swagger.tags = ['Portfolio']
  // #swagger.description = 'Endpoint to get portfolio with securities'
  /* #swagger.responses[200] = {
    schema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "portfolio id"
        },
        name: {
          type: "string",
          description: "name of the portfolio"
        },
        securities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              ticker_symbol: {
                type: "string",
                description: "Ticker symbol"
              },
              average_buy_price: {
                type: "number",
                description: "average buy price of the security"
              },
              shares: {
                type: "number",
                description: "shares available for the security"
              }
            }
          }
        }
      }
    }
  } */
  /* #swagger.responses[400] = {
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "error message"
        }
      }
    }
  } */
  const { portfolio_id: portfolioId } = req.params;

  try {
    const portfolio = await SQLGetPortfolio({ portfolioId });
    const securities = await SQLGetAllSecurities({ portfolioId });

    portfolio.securities = securities;

    return res.status(200).json(portfolio);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Fetching portfolio failed"
    });
  }
};

const getReturns = async (req, res) => {
  // #swagger.tags = ['Portfolio']
  // #swagger.description = 'Endpoint to get returns'
  /* #swagger.responses[200] = {
    schema: {
      type: "object",
      properties: {
        returns: {
          type: "number",
          description: "returns of a portfolio"
        }
      }
    }
  } */
  /* #swagger.responses[400] = {
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "error message"
        }
      }
    }
  } */
  const { portfolio_id: portfolioId } = req.params;

  try {
    const securities = await SQLGetAllSecurities({ portfolioId });

    let returns = 0;

    securities.forEach(security => {
      console.log(getCurrentPrice(security.ticker_symbol), security.average_buy_price, security.shares);
      returns += (getCurrentPrice(security.ticker_symbol) - security.average_buy_price) * security.shares;
    });

    return res.status(200).json({ returns });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Fetching portfolio failed"
    });
  }
};

module.exports = {
  getPortfolio,
  getReturns
};