const { SQLGetAllSecurities } = require('../../model/securities');
const { SQLGetTradesWithSecurities } = require('../../model/trade');

const getTrades = async (req, res) => {
  // #swagger.tags = ['Trade']
  // #swagger.description = 'Endpoint to get all trades'
  /* #swagger.responses[200] = {
      schema: {
        type: "array",
        items: {
          properties: {
          ticker_symbol: {
            type: "string",
            description: "ticker symbol"
          },
          average_buy_price: {
            type: "number",
            description: "Average buy price for the security"
          },
          shares: {
            type: "number",
            description: "Shares available for the security"
          },
          trades: {
            type: "array",
            items: {
              type: "object",
              properties: {
                  id: {
                    type: "string",
                    description: "trade id"
                  },
                  trade_type: {
                    type: "string",
                    description: "type of the trade"
                  },
                  ticker_symbol: {
                    type: "string",
                    description: "ticker symbol"
                  },
                  buy_price: {
                    type: "number",
                    description: "the price of share when creating the trade"
                  },
                  quantity: {
                    type: "number",
                    description: "quantity that has been traded"
                  }
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
    const securities = await SQLGetAllSecurities({ portfolioId });
    const trades = await SQLGetTradesWithSecurities({ portfolioId });

    const tradesResults = {};

    trades.forEach((trade) => {
      if (tradesResults[trade.ticker_symbol]) {
        tradesResults[trade.ticker_symbol].push(trade);
      } else {
        tradesResults[trade.ticker_symbol] = [trade];
      }
    });

    const securityData = securities.map((security) => {
      if (tradesResults[security.ticker_symbol]) {
        // eslint-disable-next-line no-param-reassign
        security.trades = tradesResults[security.ticker_symbol];
        return security;
      }
      return security;
    });

    return res.status(200).json(securityData);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Fetching trades failed',
    });
  }
};

module.exports = getTrades;
