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
  required: ['portfolio_id', 'trade_type', 'ticker_symbol', 'quantity'],
};

const updateTradeSchema = {
  type: 'object',
  minProperties: 1,
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
