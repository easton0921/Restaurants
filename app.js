const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');
const crypto = require('crypto');
const cryptoJS = require('crypto-js');
const contextService = require('request-context');
const helmet = require('helmet');
const compression = require('compression');
const { requestLogger } = require('./app/middlewares/logger');
const { logger } = require('./app/middlewares/logger');
const encodeDecode = require("./app/middlewares/decryption");





const app = express();

// app.use((req, res, next) => {
//     if (req.url.includes('/webhook')) {
//         next();
//     } else {
//         express.json()(req, res, next);
//     }
// });
// this for webhook ============================================================================
app.use((req, res, next) => {
    if (req.originalUrl.includes('/webhook')) {
        express.json({
            verify: (req, res, buf) => {
                req.rawBody = buf.toString();
            }
        })(req, res, next);
    } else {
        express.json()(req, res, next);
    }
});
app.use(requestLogger);
app.use(compression());
app.use(helmet());

// API Encrption
global.Decode = require("./app/middlewares/decryption");
global.Encode = require("./app/middlewares/encryption");
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'stag') {
    app.use(async function (req, res, next) {
        if (req.headers.appkey && req.headers.appkey == process.env.APPKEY || await encodeDecode.withoutEncryptionApi(req)) {
            next();
        } else {
            console.log("----------------------------");
            await encodeDecode.decrypWithSek(req, res, next);
            console.log("===============================");
        }
    });
}
app.use(require("./app/middlewares/response"));

require('./app/utils/global');

global.AppDir = 'core';

global.isAdminPortal = false;
global.isUserPortal = false;
global.isStaffPortal = false;

global.Moment = require('moment');
global.Logger = logger
global.Mongoose = mongoose;
// global.ObjectId = new mongoose.Types.ObjectId;
global.ObjectId = (key) => new mongoose.Types.ObjectId(key);
global.CryptoJS = cryptoJS;
global.Crypto = crypto;
global.Fs = require('fs');
global.Path = require('path');
global.constants = require("./config/constants");
global.Validator = require("./app/middlewares/validator");
global.Validations = require("./app/validations");
global.Func = require("./app/utils/functions");
global.Model = require("./app/models");
global.pagination_limit = 10;


global.MSG = require("./locals/en");//change langugae message
global.Email_Template = require("./emailTemplates/en");
global.dbHelper = require("./app/utils/dbHelper");

app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()), // Send Morgan logs to Winston
        },
    })
);

app.use((req, res, next) => {
    next();
});

//============================================================================================================

/**
 * Load services
*/
global.Services = require('./app/loadServices');
app.use('/images', express.static(__dirname + "/multerImages"))


/**
 * Connect database
 */
require('./startup/db').connectMongoDB();

/**
 * Run migration
 */
require('./startup/migration').migrate();

/**
 * Connect redis
 */
// require('./startup/redis').connectRedis();

app.use(contextService.middleware('request'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(
    {
        exposedHeaders: ['x-access-token', 'x-tenant'],
        origin: true
    }
));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use(function (req, res, next) {
    req.loggerId = Math.floor(10000 + Math.random() * 10000);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'x-access-token,x-timezone,Content-Type, x-portal, x-tenant');
    res.header('Access-Control-Max-Age', 1728000);
    if (req.originalUrl === '/' || req.originalUrl.trim() === '') {
        res.send("Health check passed");
        return;
    }
    req.timezone = req.headers['x-timezone'];


    if (req.url.includes('/webhook')) {
        req.headers['x-portal'] = 'user';
    }

    if (!(['user', 'staff'].includes(req.headers['x-portal'])) && !req.path.includes('documentation')) {
        next(new Error('In-proper Request'));
    } else {
        global.isUserPortal = (req.headers['x-portal'] === 'user');
        global.isStaffPortal = (req.headers['x-portal'] === 'staff');

        next();
    }
});

global.Auth = require("./app/middlewares/auth");

const { NODE_ENV = "dev", NODE_MODULE_TYPE = "" } = process.env;

// global.io = require("socket.io-client")(Config.get("SocketIO_URL"));
// io.on('connect', () => {
//     console.log("connected");
// });

/**
 * Load controllers
*/
require('./app/loadControllers')(app);

app.get('/', (_req, res) => {
    res.send("Health check passed");
});

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(createError(404));
});

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    const status = error.status || 500;
    const message = process.env.NODE_ENV === 'prod' ? 'Internal Server Error' : error.message;

    logger.error(`Error: ${status} - ${message} - ${req.method} ${req.url}`);

    return res.status(status).json({ success: false, message });
});


module.exports = app;
