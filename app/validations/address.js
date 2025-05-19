const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.createAddress = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.number().required(),
    isDefault: Joi.boolean().required(),
    addressLabel: Joi.number().valid(...Object.values(constants.ADDRESS_LABEL)).required(),
    country: Joi.number().valid(...Object.values(constants.COUNTRY_TYPE)).required(),
})

module.exports.updateAddress = Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    postalCode: Joi.number().optional(),
    isDefault: Joi.boolean().optional(),
    addressLabel: Joi.number().valid(...Object.values(constants.ADDRESS_LABEL)).optional(),
    country: Joi.number().valid(...Object.values(constants.COUNTRY_TYPE)).optional(),
})