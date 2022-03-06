const swaggerAutogen = require('swagger-autogen')()

const outputFile = "./temp/swagger_output.json";
const endpointsFiles = ["./app/routes/index.js"]

swaggerAutogen(outputFile, endpointsFiles);
