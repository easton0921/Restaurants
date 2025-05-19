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
   * Validation for cms edit
   */
  module.exports.update = Joi.object({
    email: Joi.string().email().optional(),
    countryCode : Joi.string().optional(),
    phone: Joi.string().optional(),
    terms: Joi.string().optional(),
    terms_ar: Joi.string().optional(),
    privacyPolicy: Joi.string().optional(),
    privacyPolicy_ar: Joi.string().optional(),
    aboutUs: Joi.string().optional(),
    aboutUs_ar: Joi.string().optional(),
  });
  