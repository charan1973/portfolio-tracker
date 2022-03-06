const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./temp/swagger_output.json');
require('./config/database');

const indexRouter = require('./app/routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api', indexRouter);

module.exports = app;
