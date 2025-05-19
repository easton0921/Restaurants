module.exports = (schema, property = "body") => {
    
    if (!schema || typeof schema.validate !== "function") {
        throw new Error("Invalid schema provided for validation middleware.");
    }

    return (req, res, next) => {
        const dataToValidate = req[property];

        // Check if data exists before validation
        if (!dataToValidate || typeof dataToValidate !== "object") {
            return res.status(422).json({
                status: "error",
                message: `Missing or invalid data in request ${property}`,
                errors: [],
            });
        }

        // Validate request data using Joi
        const { error } = schema.validate(dataToValidate, { abortEarly: false });

        if (error) {
            const errors = error.details.map((err) => ({
                field: err.path.join("."), // Joins nested field names like "user.email"
                message: err.message.replace(/["]/g, ""), // Removes extra quotes from error messages
            }));

            return res.status(400).json({
                status: "error",
                message: "Validation error",
                errors,
            });
        }

        next(); // Pass control to the next middleware/controller
    };
};