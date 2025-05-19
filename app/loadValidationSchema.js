
const joiToSwagger = require('joi-to-swagger');
let schemas = {};

try {
    let validationsPathStr = './app' + '/validations';
    if (Fs.existsSync(validationsPathStr)) {
        let validationsPath = Fs.readdirSync(validationsPathStr);
        validationsPath.forEach(function (file) {
            if (file.endsWith(".js") && file !== "index.js") {
                let validationPath = Path.join(__dirname + '/validations/' + file);

                let fileName = file.replace(/\.[^/.]+$/, "");
                if (!!fileName && Fs.existsSync(validationPath)) {
                    let validationModule = require(validationPath);

                    // Convert each exported Joi schema in the module to a Swagger schema
                    Object.entries(validationModule).forEach(([schemaName, joiSchema]) => {
                        const { swagger: swaggerSchema } = joiToSwagger(joiSchema); // Convert Joi to Swagger
                        schemas[`${fileName}${schemaName}`] = swaggerSchema; // Store in schemas object
                    });
                }
            }
        });
    }
} catch (e) {
    throw new Error(e);
}

module.exports = schemas;
