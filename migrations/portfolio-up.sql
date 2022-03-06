CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE portfolio (
    id UUID DEFAULT UUID_GENERATE_V4(),
    name VARCHAR(100),
    PRIMARY KEY(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE securities (
    portfolio_id UUID,
    ticker_symbol VARCHAR(10),
    average_buy_price DOUBLE PRECISION,
    shares INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(portfolio_id, ticker_symbol),
    FOREIGN KEY(portfolio_id) REFERENCES portfolio(id)
);

CREATE TYPE trade_type_enum AS ENUM ('BUY', 'SELL');

CREATE TABLE trades (
    id UUID DEFAULT UUID_GENERATE_V4(),
    portfolio_id UUID,
    trade_type trade_type_enum,
    ticker_symbol VARCHAR(10),
    previous_avg_buy DOUBLE PRECISION,
    current_buy_price DOUBLE PRECISION,
    quantity SERIAL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(portfolio_id) REFERENCES portfolio(id)
);