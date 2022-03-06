# Portfolio Tracker

A simple porfolio tracker app which manages portfolio, securities and trades. Hosted on Heroku and uses postgresql add-on provided by Heroku.

## Tech Stack
- Nodejs/Express
- PostgreSQL
- node-pg and pg-pool (db driver and connection pooling)
- ajv (for schema validation)
- Swagger auto gen (for documentation)

## Installation
- Step 1:
Clone the repo

`git clone https://github.com/charan1973/portfolio-tracker`

- Step 2:
Change directory to the repo

`cd portfolio-tracker`

- Step 3:
Add .env to the root directory with following vars

```
DATABASE_URL=""
```

- Step 4:
Install dependencies

`npm i`

- Step 5:
Start the app

```
npm start
```

- Step 6:
Run migration(no migration tool setup, so running `migrations/portfolio-up.sql` on db client should help)

- Step 7:
Run seeds(no seeds tool setup, run the `seeds/portfolio.sql`)

Access the app documentation from `/doc`: [REST documentation](https://portfolio-tracker-sc.herokuapp.com/doc)

**NOTE**: App is hosted on Heroku free tier. Heroku forces the service to sleep if 30 minutes of inactivity. Please wait for the app to boot on first request.

## **Usage:**
App already has created a sample portfolio with id: `46e9d384-09e2-4135-9c9d-c024e5567a50`

Use the documentation to create, update, delete trade.

- Get all trades

`GET /api/trade/46e9d384-09e2-4135-9c9d-c024e5567a50`


- Create trade

`POST /api/trade`

```
req.body = {
    "portfolio_id": "46e9d384-09e2-4135-9c9d-c024e5567a50",
    "trade_type": "BUY",
    "ticker_symbol": "TCS",
    "current_buy_price": 300,
    "quantity": 10
}
```

- Update trade

`PUT /api/trade/46e9d384-09e2-4135-9c9d-c024e5567a50/{trade_id}`

```
req.body = {
    "trade_type": "SELL"
}
```

- Remove trade

`DELETE /api/trade/46e9d384-09e2-4135-9c9d-c024e5567a50/{trade_id}`

- Get portfolio

`GET /api/portfolio/46e9d384-09e2-4135-9c9d-c024e5567a50`

- Get returns

`GET /api/portfolio/returns/46e9d384-09e2-4135-9c9d-c024e5567a50`

## **What all can be improved:**
- Paginating the GET apis
- Better error handling instead of generic failed message
- Implementing dependency injection
- Have service layer for handling business logic so it can be reused if there's need for new protocol
- Adding db migration tool for easy database migrations