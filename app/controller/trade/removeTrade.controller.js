const { SQLRemoveTrade } = require('../../model/trade');

const removeTrade = async (req, res) => {
  // #swagger.tags = ['Trade']
  // #swagger.description = 'Endpoint to remove a trade'
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
    #swagger.responses[200] = {
      schema: {
        type: "object",
        properties: {
          message: {
            type: "number",
            description: "trade removed message"
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
    }
    */

  const {
    portfolio_id: portfolioId,
    trade_id: tradeId,
  } = req.params;

  try {
    await SQLRemoveTrade({
      tradeId,
      portfolioId,
    });

    return res.status(200).json({
      message: 'Trade removed successfully.',
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Trade remove failed.',
    });
  }
};

module.exports = removeTrade;
