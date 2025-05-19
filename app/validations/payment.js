const Joi = require("joi").defaults((schema) => {
    switch (schema.type) {
        case "string":
            return schema.replace(/\s+/, " ");
        default:
            return schema;
    }
});

Joi.objectId = () => Joi.string().pattern(/^[0-9a-f]{24}$/, "valid ObjectId");

module.exports.paymentIntent = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required(),
    amount: Joi.number().required(),
    paymentMethodId: Joi.string().required(),
});


module.exports.paymentCheckOut = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().required(),
    amount: Joi.number().required(),
});


module.exports.paymentLink = Joi.object({
    amount: Joi.number().min(3).required(),
    currency: Joi.string().required(),
});


module.exports.subscription = Joi.object({
    name: Joi.string().min(3).required(),
    amount: Joi.number().min(3).required(),
    currency: Joi.string().required(),
    validity: Joi.string().required(),
});


module.exports.subscriptionPymaneLink = Joi.object({
    name: Joi.string().min(3).optional(),
    email: Joi.string().required(),
    subscriptionId: Joi.string().required(),

});
