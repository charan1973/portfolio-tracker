const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("./config/database");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./temp/swagger_output.json');

const indexRouter = require('./app/routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    const authorization = req.headers["authorization"];

    if (authorization) {
        req.portfolio_id = authorization;
    }
    next();
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', indexRouter);

module.exports = app;
