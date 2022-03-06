const createTradeSchema = {
  type: 'object',
  properties: {
    portfolio_id: {
      type: 'string',
    },
    trade_type: {
      type: 'string',
      enum: ['BUY', 'SELL'],
    },
    ticker_symbol: {
      type: 'string',
    },
    current_buy_price: {
      type: 'number',
    },
    quantity: {
      type: 'number',
    },
  },
};

const updateTradeSchema = {
  type: 'object',
  properties: {
    trade_type: {
      type: 'string',
      enum: ['BUY', 'SELL'],
    },
    current_buy_price: {
      type: 'number',
    },
    quantity: {
      type: 'number',
    },
  },
};

module.exports = {
  createTradeSchema,
  updateTradeSchema,
};
