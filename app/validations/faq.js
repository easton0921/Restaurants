const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
      case "string":
        return schema.replace(/\s+/, " ");
      default:
        return schema;
    }
  });
  
  Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");
  
  const defaultBody = {
    question: Joi.string().description("Ask question"),
    answer: Joi.string().description("Tell answer")
  }
  
  /**
   * Validation for create
   */
  module.exports.create = Joi.object({
    question: defaultBody.question.required(),
    answer: defaultBody.answer.required()
  });
  
  /**
   * Validation for update by id
   */
  module.exports.updateById = Joi.object({
    question: defaultBody.question.optional(),
    answer: defaultBody.answer.optional(),
    isActive: Joi.boolean().optional()
  });
  
  /**
   * Validation for delete by id
   */
  module.exports.deleteById = Joi.object({});
  