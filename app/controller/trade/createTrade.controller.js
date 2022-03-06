const { SQLCreateTrade } = require('../../model/trade');

const { validateSchema } = require('../../../validator');
const { createTradeSchema } = require('../../../validator/schema/trade.schema');
const { getCurrentPrice } = require('../../../helpers');

const createTrade = async (req, res) => {
  // #swagger.tags = ['Trade']
  // #swagger.description = 'Endpoint to create a trade'
  /* #swagger.parameters["new_trade"] = {
      in: "body",
      description: "object for creating new trade",
      required: true,
      schema: {
        type: "object",
        properties: {
          portfolio_id: {
            type: "string",
            format: "uuid",
            description: "portfolio id against which the trade needs to be created"
          },
          trade_type: {
            type: "string",
            description: "type of the trade",
            enum: ["BUY", "SELL"]
          },
          ticker_symbol: {
            type: "string",
            description: "ticker symbol for the trade"
          },
          current_price: {
            type: "number",
            description: "the buy price for the ticker symbol"
          },
          quantity: {
            type: "number",
            description: "number of shares bought"
          }
        }
      }
    }
    */
  /* #swagger.responses[200] = {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "number",
            description: "trade created message"
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
  const {
    portfolio_id: portfolioId,
    trade_type: tradeType,
    ticker_symbol: tickerSymbol,
    current_price: currentPrice,
    quantity,
  } = req.body;

  try {
    validateSchema(createTradeSchema, req.body);

    await SQLCreateTrade({
      portfolioId,
      tradeType,
      tickerSymbol,
      currentPrice: currentPrice || getCurrentPrice(tickerSymbol),
      quantity,
    });

    return res.status(200).json({
      message: 'Trade added successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Trade failed.',
    });
  }
};

module.exports = createTrade;
