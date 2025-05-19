const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Swagger = {
    title: 'Restaurants REST API',
    description: "REST API.",
    openApi: '3.0.1',
    bearerToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Bearer token for API access."
    }
};

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: Swagger.title,
            version: '1.0.0',
            description: Swagger.description,
        },
        openapi: Swagger.openApi,
        components: {
            schemas: require('./loadValidationSchema'),
            securitySchemes: {
                bearerAuth: Swagger.bearerToken, 
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: []
};

const Routes = function (app) {
    let NODE_MODULE = process.env.NODE_MODULE;
    const prefix = AppDir === 'admin' ? 'admin/' : '';
    const modules = Fs.readdirSync(__dirname + '/modules');
    const folders = modules.filter(element => Fs.statSync(Path.join(__dirname + '/modules', element)).isDirectory());
    
    let allApiPath = [];
    folders.forEach(function (folder) {
        if (NODE_MODULE) {
            if (NODE_MODULE === 'common') {
                let otherModules = ['user'];
                if (otherModules.indexOf(folder) > -1) {
                    return;
                }
            } else if (NODE_MODULE != folder) {
                return;
            }
        }
        
        let controllers = './app' + '/modules/' + folder + '/' + AppDir + '/' + 'controllers';
        try {
            if (Fs.existsSync(controllers)) {
                let controllersPath = Fs.readdirSync(controllers);
                controllersPath.forEach(function (file) {
                    let routerPath = Path.join(__dirname + '/modules/' + folder + '/' + AppDir + '/' + 'controllers/' + file);
                    let contName = file.replace(/\.[^/.]+$/, "");
                    if (!!contName && Fs.existsSync(routerPath)) {
                        allApiPath.push(routerPath);
                        let controller = require(routerPath);
                        
                        app.use('/' + prefix + contName, controller);
                    }
                });
            }
        } catch (e) {
            throw new Error(e);
        }
    });

    swaggerOptions.apis = allApiPath;
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.get('/' + AppDir + '/documentation.json', (req, res) => res.json(swaggerDocs));
    app.use('/' + AppDir + '/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

module.exports = Routes;
