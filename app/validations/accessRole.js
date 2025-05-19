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
    name: Joi.string().optional().allow("", null),
    permission: Joi.array().items({
      sideBarId: Joi.number().valid(...Object.values(constants.MODULES)).optional(),
      label: Joi.string().optional(),
      path: Joi.string().optional(),
      icon: Joi.string().optional(),
      isSubMenu: Joi.boolean().optional(),
      subMenuItems: Joi.array().optional(),
      isSubAdmin: Joi.boolean().optional(),
      isView: Joi.boolean().optional(),
      isEdit: Joi.boolean().optional(),
      isAdd: Joi.boolean().optional(),
      isDelete: Joi.boolean().optional()
    }).required()
  }
  
  /**
   * Validation for create
   */
  module.exports.create = Joi.object({
    ...defaultBody
  });
  
  /**
   * Validation for update by id
   */
  module.exports.updateById = Joi.object({
    name: Joi.string().optional().allow("", null),
    permission: Joi.array().items({
      sideBarId: Joi.number().valid(...Object.values(constants.MODULES)).optional(),
      label: Joi.string().optional(),
      path: Joi.string().optional(),
      icon: Joi.string().optional(),
      isSubMenu: Joi.boolean().optional(),
      subMenuItems: Joi.array().optional(),
      isSubAdmin: Joi.boolean().optional(),
      id: Joi.string().optional(),
      _id: Joi.string().optional(),
      isView: Joi.boolean().optional(),
      isEdit: Joi.boolean().optional(),
      isAdd: Joi.boolean().optional(),
      isDelete: Joi.boolean().optional(),
      _id: Joi.objectId().optional(),
    }).optional(),
    isBlocked: Joi.boolean().optional()
  });
  
  /**
   * Validation for delete by id
   */
  module.exports.deleteById = Joi.object({});
  