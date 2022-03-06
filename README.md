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

Access the app documentation from `/doc`: [REST documentation](https://portfolio-tracker-sc.herokuapp.com/doc)