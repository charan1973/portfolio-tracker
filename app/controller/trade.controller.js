const { SQLGetAllSecurities } = require("../model/securities");
const { SQLCreateTrade, SQLRemoveTrade, SQLGetTradesWithSecurities, SQLUpdateTrade } = require("../model/trade");
const { validateSchema } = require("../../validator");
const { createTradeSchema, updateTradeSchema } = require("../../validator/schema/trade.schema");

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
        current_buy_price: {
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
      current_buy_price: currentBuyPrice,
      quantity
  } = req.body;

  
  try {
    validateSchema(createTradeSchema, req.body);

    await SQLCreateTrade({
      portfolioId,
      tradeType,
      tickerSymbol,
      currentBuyPrice,
      quantity
    });

    return res.status(200).json({
      message: "Trade added successfully."
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Trade failed."
    });
  }
};

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
    trade_id: tradeId
  } = req.params;

  try {
    await SQLRemoveTrade({
      tradeId,
      portfolioId
    });

    return res.status(200).json({
      message: "Trade removed successfully."
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Trade remove failed."
    });
  }
};

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
        current_buy_price: {
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
    trade_id: tradeId
  } = req.params;

  const {
    trade_type: tradeType,
    current_buy_price: currentBuyPrice,
    quantity
  } = req.body;

  try {
    validateSchema(updateTradeSchema, req.body);

    await SQLUpdateTrade({
      portfolioId,
      tradeId,
      tradeType,
      currentBuyPrice,
      quantity
    });

    return res.status(200).json({
      message: "Trade updated successfully."
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Trade update failed."
    });
  }
};

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
    let securities = await SQLGetAllSecurities({ portfolioId });
    let trades = await SQLGetTradesWithSecurities({ portfolioId });

    const tradesResults = {};

    trades.forEach(trade => {
      if (tradesResults[trade.ticker_symbol]) {
        tradesResults[trade.ticker_symbol].push(trade);
      } else {
        tradesResults[trade.ticker_symbol] = [trade];
      }
    });

    const securityData = securities.map(security => {
      if (tradesResults[security.ticker_symbol]) {
        security.trades = tradesResults[security.ticker_symbol];
        return security;
      }
    });

    return res.status(200).json(securityData);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Fetching trades failed"
    });
  }
};

module.exports = {
  createTrade,
  removeTrade,
  getTrades,
  updateTrade
};