const { validateSchema } = require('../../../validator');
const { updateTradeSchema } = require('../../../validator/schema/trade.schema');
const { SQLUpdateTrade } = require('../../model/trade');

const updateTrade = async (req, res) => {
  // #swagger.tags = ['Trade']
  // #swagger.description = 'Endpoint to update a trade'
  /*
    #swagger.parameters["portfolio_id"] = {
      description: "portfolio id from where the trade should be removed",
      required: true,
      schema: {
        type: "string"
      }
    }
    #swagger.parameters["trade_id"] = {
      description: "trade id of trade which should be removed",
      required: true,
      schema: {
        type: "string"
      }
    }
    #swagger.parameters["update_trade"] = {
      in: "body",
      description: "object for updating existing trade",
      required: true,
      schema: {
        type: "object",
        properties: {
          trade_type: {
            type: "string",
            description: "type of the trade",
            enum: ["BUY", "SELL"]
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
    #swagger.responses[200] = {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "number",
            description: "trade updated message"
          }
        }
      }
    }
    #swagger.responses[400] = {
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
    trade_id: tradeId,
  } = req.params;

  const {
    trade_type: tradeType,
    current_price: currentPrice,
    quantity,
  } = req.body;

  try {
    validateSchema(updateTradeSchema, req.body);

    await SQLUpdateTrade({
      portfolioId,
      tradeId,
      tradeType,
      currentPrice,
      quantity,
    });

    return res.status(200).json({
      message: 'Trade updated successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Trade update failed.',
    });
  }
};

module.exports = updateTrade;
