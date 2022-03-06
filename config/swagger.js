const swaggerAutogen = require('swagger-autogen')()

const outputFile = "./temp/swagger_output.json";
const endpointsFiles = ["./routes/index.js"]

swaggerAutogen(outputFile, endpointsFiles);
