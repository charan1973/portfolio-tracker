const swaggerAutogen = require('swagger-autogen')();
const { envVariables } = require('.');

const outputFile = './temp/swagger_output.json';
const endpointsFiles = ['./app/routes/index.js'];

const swaggerConfig = {
  host: envVariables.host_url,
  basePath: '/api/',
  schemes: envVariables.host_url === 'production' ? 'https' : 'http',
};

swaggerAutogen(outputFile, endpointsFiles, swaggerConfig);
