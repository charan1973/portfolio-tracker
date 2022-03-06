const Ajv = require("ajv");
const ajv = new Ajv();

const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    throw validate.errors;
  }
};

module.exports = {
  validateSchema
};
