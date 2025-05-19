const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
      case "string":
        return schema.replace(/\s+/, " ");
      default:
        return schema;
    }
  });
  
  
  
  Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");
  
  module.exports.createCategory = Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    image: Joi.string().required(),
    description : Joi.string().optional(),
  });


  module.exports.updateCategory = Joi.object({
    name: Joi.string().trim().min(1).max(100).optional(),
    image: Joi.string().optional(),
    description : Joi.string().optional(),
  });

//======================================subCategory====================================================================


  module.exports.createSubCategory = Joi.object({
    name: Joi.string().trim().min(1).max(100).required(),
    categoryId: Joi.string().required(),
  });


  module.exports.updateSubCategory = Joi.object({
    name: Joi.string().trim().min(1).max(100).optional(),
    categoryId: Joi.string().optional(),
  });

  
  
  