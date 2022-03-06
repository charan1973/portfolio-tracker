const pool = require('../../config/database');

const TRADE = {};

/**
 * Getting new average buy price for security
 * @param {Object} param.newPrice The trade price
 * @param {Object} param.newPriceQuantity The trade quantity for the price
 * @param {Object} param.oldPrice Previous average buy price of the security
 * @param {Object} param.oldPrice Shares available for the security
 * @param {Object} param.tradeType Type of the trade
 * @returns {Object} price and quantity with the new trade
 */
const currentAverageBuyPrice = ({
  newPrice, newPriceQuantity, oldPrice, oldPriceQuantity, tradeType,
}) => {
  let price;
  let quantity;
  if (tradeType === 'BUY') {
    quantity = (oldPriceQuantity + newPriceQuantity);
    price = ((newPrice * newPriceQuantity) + (oldPrice * oldPriceQuantity)) / quantity;
  } else if (tradeType === 'SELL') {
    quantity = oldPriceQuantity - newPriceQuantity;

    if (quantity < 0) throw Error('Value goes negative');

    if (quantity === 0) {
      price = 0;
    } else {
      price = ((oldPrice * oldPriceQuantity) - (newPrice * newPriceQuantity)) / quantity;
    }

    if (price < 0) throw Error('Value goes negative');
  }
  return {
    price,
    quantity,
  };
};

/**
 * Get query and values for security
 * @param {String} portfolioId portfolio id that the security needs to be fetched for
 * @param {String} tickerSymbol ticker symbol to get the security combined with portfolio id
 * @returns {Object} query and value as an array
 */
const getSecurityQuery = (portfolioId, tickerSymbol) => {
  const query = `
    SELECT average_buy_price, shares
    FROM securities WHERE portfolio_id = $1 AND ticker_symbol = $2
    LIMIT 1;
  `;
  const values = [portfolioId, tickerSymbol];

  return [query, values];
};

/**
 * Get query and values for trade
 * @param {String} portfolioId portfolio id that the trade needs to be fetched
 * @param {String} tickerSymbol trade id to get the trade combined with portfolio id
 * @returns {Object} query and value as an array
 */
const getTradeQuery = (tradeId, portfolioId) => {
  const query = `
    SELECT trade_type, ticker_symbol, previous_avg_buy, current_buy_price, quantity
    FROM trades
    WHERE id = $1 AND portfolio_id = $2 AND deleted = FALSE;
  `;
  const values = [tradeId, portfolioId];

  return [query, values];
};

/**
 * Create trade in db model
 * @param {String} param.portfolioId porfolio id against which the trade has to be created
 * @param {String} param.tradeType type of trade that is being made(BUY or SELL)
 * @param {String} param.tickerSymbol ticker symbol for which the trade is being made
 * @param {Number} param.currentBuyPrice the buy price of the share
 * @param {Number} param.quantity number of shares being bought
 * @returns {*} returns nothing if passed else throws error
 */
TRADE.SQLCreateTrade = async ({
  portfolioId,
  tradeType,
  tickerSymbol,
  currentBuyPrice,
  quantity,
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // begin transaction

    const { rows } = await client
      .query(...getSecurityQuery(portfolioId, tickerSymbol)); // get the security if it exists
    const security = {
      average_buy_price: rows[0]?.average_buy_price || 0,
      shares: rows[0]?.shares || 0,
    };
    const tradeEntryQuery = `
      INSERT INTO trades(
        portfolio_id,
        trade_type,
        ticker_symbol,
        previous_avg_buy,
        current_buy_price,
        quantity
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const tradeEntryValues = [
      portfolioId,
      tradeType,
      tickerSymbol,
      security.average_buy_price,
      currentBuyPrice,
      quantity,
    ];
    await client.query(tradeEntryQuery, tradeEntryValues); // create trade entry

    const upsertSecurityQuery = `
      INSERT INTO securities(portfolio_id, ticker_symbol, average_buy_price, shares)
      VALUES ($1, $2, $3, $4)
      On CONFLICT(portfolio_id, ticker_symbol)
      DO UPDATE SET average_buy_price = $3, shares = $4, updated_at = CURRENT_TIMESTAMP;
    `;
    const newAveragePrice = currentAverageBuyPrice({
      newPrice: currentBuyPrice,
      newPriceQuantity: quantity,
      oldPrice: security.average_buy_price,
      oldPriceQuantity: security.shares,
      tradeType,
    });
    const upsertSecurityValues = [
      portfolioId,
      tickerSymbol,
      newAveragePrice.price,
      newAveragePrice.quantity,
    ];
    await client.query(upsertSecurityQuery, upsertSecurityValues); // upsert security
    await client.query('COMMIT'); // commit to db
  } catch (error) {
    await client.query('ROLLBACK'); // rollback on failure
    throw error;
  } finally {
    client.release(); // release after rollback or commit
  }
};

/**
 * Revert the price back to previous average price
 * @param {Number} param.tradeQuantity quantity that needs to be removed(from the trade)
 * @param {Number} param.shareQuantity quantity that exists in the security at the moment
 * @param {Number} param.prevPrice previous average buy price of the security(from trade object)
 * @param {Number} param.tradeType type of trade(to remove or add based on buy or sell)
 * @returns {Object} price and quantity that was previous before the remove trade
 */
const revertPrice = ({
  tradeQuantity, shareQuantity, prevPrice, tradeType,
}) => {
  let price;
  let quantity;

  if (tradeType === 'BUY') {
    quantity = shareQuantity - tradeQuantity;
    if (quantity < 0) throw Error('Value goes negative');
    if (quantity === 0) {
      price = 0;
    } else {
      price = prevPrice * quantity;
    }
    if (price < 0) throw Error('Value goes negative');
  } else if (tradeType === 'SELL') {
    quantity = shareQuantity + tradeQuantity;

    price = (prevPrice * quantity) / quantity;
  }

  return {
    price,
    quantity,
  };
};

/**
 * Remove a trade from db
 * @param {String} param.portfolioId porfolio id that owns the trade
 * @param {String} param.tradeId trade that needs to be removed
 * @returns {*} returns nothing if passed else throws error
 */
TRADE.SQLRemoveTrade = async ({
  tradeId,
  portfolioId,
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // begin transaction

    const { rows: [tradeData] } = await client
      .query(...getTradeQuery(tradeId, portfolioId)); // get the trade to remove

    if (!tradeData) {
      client.query('ROLLBACK');
      throw new Error("Trade doesn't exist");
    }

    const { rows: [securityData] } = await client
      .query(...getSecurityQuery(portfolioId, tradeData.ticker_symbol)); // get security to update

    const updatedAveragePrice = revertPrice({ // get the old average buy price
      tradePrice: tradeData.current_buy_price,
      tradeQuantity: tradeData.quantity,
      avgBuyPrice: securityData.average_buy_price,
      shareQuantity: securityData.shares,
      prevPrice: tradeData.previous_avg_buy,
      tradeType: tradeData.trade_type,
    });

    const removeTradeQuery = `
      UPDATE trades
      SET deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND portfolio_id = $2;
    `;
    const removeTradeValues = [tradeId, portfolioId];

    await client.query(removeTradeQuery, removeTradeValues); // remove trade

    const revertSecurityQuery = `
      UPDATE securities
      SET average_buy_price = $1, shares = $2, updated_at = CURRENT_TIMESTAMP
      WHERE portfolio_id = $3 AND ticker_symbol = $4;
    `;
    const revertSecurityValues = [
      updatedAveragePrice.price,
      updatedAveragePrice.quantity,
      portfolioId,
      tradeData.ticker_symbol,
    ];

    await client.query(revertSecurityQuery, revertSecurityValues); // update security
    await client.query('COMMIT'); // commit
  } catch (error) {
    await client.query('ROLLBACK'); // rollback on failure
    throw error;
  } finally {
    client.release(); // release client
  }
};

/**
 * @param {String} param.portfolioId porfolio id that owns the trade
 * @param {String} param.tradeId trade that needs to be updates
 * @param {String} param.tradeType trade type to be updated to
 * @param {Number} param.currentBuyPrice updating the current buy price
 * @param {Number} param.quantity quantity to be updated to
 * @returns {*} returns nothing if passed else throws error
 */
TRADE.SQLUpdateTrade = async ({
  portfolioId,
  tradeId,
  tradeType,
  currentBuyPrice,
  quantity,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // begin transaction

    const { rows: [tradeData] } = await client
      .query(...getTradeQuery(tradeId, portfolioId)); // get the trade for update
    if (!tradeData) {
      client.query('ROLLBACK');
      throw new Error("Trade doesn't exist");
    }

    const newTradeObj = { // create updated trade obj
      ...(tradeType !== tradeData.trade_type && { tradeType }),
      ...(currentBuyPrice !== tradeData.current_buy_price && { currentBuyPrice }),
      ...(quantity !== tradeData.quantity && { quantity }),
    };

    const updateTradeQuery = `
      UPDATE trades
      SET ${newTradeObj.tradeType ? `trade_type = '${newTradeObj.tradeType}', ` : ''}
      ${newTradeObj.currentBuyPrice ? `current_buy_price = ${newTradeObj.currentBuyPrice}, ` : ''}
      ${newTradeObj.quantity ? `quantity = ${newTradeObj.quantity}, ` : ''}
      updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND portfolio_id = $2;
    `;
    const updateTradeValues = [tradeId, portfolioId];

    await client.query(updateTradeQuery, updateTradeValues); // update the trade

    const { rows: [securityData] } = await client
      .query(...getSecurityQuery(portfolioId, tradeData.ticker_symbol)); // get security to update

    const updatedAveragePrice = revertPrice({ // revert the trade to old price
      tradePrice: tradeData.current_buy_price,
      tradeQuantity: tradeData.quantity,
      avgBuyPrice: securityData.average_buy_price,
      shareQuantity: securityData.shares,
      prevPrice: tradeData.previous_avg_buy,
      tradeType: tradeData.trade_type,
    });

    const newAverageBuyPriceParam = {
      newPrice: typeof newTradeObj.currentBuyPrice === 'number' ? newTradeObj.currentBuyPrice : tradeData.current_buy_price,
      newPriceQuantity: typeof newTradeObj.quantity === 'number' ? newTradeObj.quantity : tradeData.quantity,
      oldPrice: updatedAveragePrice.price,
      oldPriceQuantity: updatedAveragePrice.quantity,
      tradeType: newTradeObj.tradeType ? newTradeObj.tradeType : tradeData.trade_type,
    };
    const updatedSecurity = currentAverageBuyPrice(
      newAverageBuyPriceParam,
    ); // update it as new trade entry

    const updateSecurityQuery = `
      UPDATE securities
      SET average_buy_price = $1,
      shares = $2,
      updated_at = CURRENT_TIMESTAMP
      WHERE ticker_symbol = $3 AND portfolio_id = $4;
    `;

    const updateSecurityValues = [
      updatedSecurity.price,
      updatedSecurity.quantity,
      tradeData.ticker_symbol,
      portfolioId,
    ];

    await client.query(updateSecurityQuery, updateSecurityValues);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * @param {String} param.portfolioId porfolio id for which the trade to be fetched
 * @returns {*} returns array of trades if valued query else throws error
 */
TRADE.SQLGetTradesWithSecurities = async ({ portfolioId }) => {
  const query = `
    SELECT id, trade_type, ticker_symbol, current_buy_price AS buy_price, quantity
    FROM trades
    WHERE portfolio_id = $1 AND deleted = FALSE;
  `;
  const values = [portfolioId];

  // eslint-disable-next-line no-useless-catch
  try {
    const { rows: trades } = await pool.query(query, values); // get all trades for the security
    return trades;
  } catch (error) {
    throw error;
  }
};

module.exports = TRADE;
