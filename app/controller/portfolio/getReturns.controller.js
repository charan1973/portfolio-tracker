const { getCurrentPrice } = require('../../../helpers');
const { SQLGetAllSecurities } = require('../../model/securities');

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

    securities.forEach((security) => {
      returns += (
        getCurrentPrice(security.ticker_symbol) - security.average_buy_price
      ) * security.shares;
    });

    return res.status(200).json({ returns });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Fetching portfolio failed',
    });
  }
};

module.exports = getReturns;
