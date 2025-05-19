const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
      case "string":
        return schema.replace(/\s+/, " ");
      default:
        return schema;
    }
  });
  
  Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");
  
  /**
   * Validation for admin login
   */
  module.exports.login = Joi.object({
    email: Joi.string().email().required().description('email of the admin'),
    password: Joi.string().required().description('password of the admin'),
  });
  
  module.exports.logout = Joi.object({});