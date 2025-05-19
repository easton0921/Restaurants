const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');
const crypto = require('crypto');
const cryptoJS = require('crypto-js');
const moment = require('moment');
const contextService = require('request-context');
const encodeDecode = require("./app/middlewares/decryption");
const compression = require('compression');
const { requestLogger } = require('./app/middlewares/logger');
const { logger } = require('./app/middlewares/logger');
const helmet = require('helmet');
const app = express();

app.use(express.json({limit: '50mb'}));
app.use(require("./app/middlewares/response"));
app.use(requestLogger);
app.use(compression());
app.use(helmet());

require('./app/utils/global');

global.AppDir = 'admin';

global.isAdminPortal = false;
global.isUserPortal = false;
global.isStaffPortal = false;

global.Moment = require('moment');
global.logger = require('./app/middlewares/logger');
global.Mongoose = mongoose;
global.Logger = logger
global.Moment = moment;
global.Crypto = crypto;
global.CryptoJS = cryptoJS;
global.ObjectId = (key) => new mongoose.Types.ObjectId(key);
global.Fs = require('fs');
global.Path = require('path');
global.constants = require("./config/constants");
global.Validator = require("./app/middlewares/validator");
global.Validations = require("./app/validations");
global.Func = require("./app/utils/functions");
global.Model = require("./app/models");
global.dbHelper = require("./app/utils/dbHelper");
global.MSG = require("./locals/en");
global.Email_Template = require("./emailTemplates/en");
global.pagination_limit = 10;

app.use(cors());
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()), // Send Morgan logs to Winston
        },
    })
);

// API Encrption
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'stag') {
    console.log("=========?????")
    app.use(async function (req, res, next) {
        if (req.headers.appkey && req.headers.appkey == process.env.APPKEY || await encodeDecode.withoutEncryptionApi(req)) {
            next();
        } else {
            await encodeDecode.decrypWithSek(req, res, next);
        }
    });
}

/**
 * Load services
*/
global.Services = require('./app/loadServices');

/**
 * Connect database
 */
require('./startup/db').connectMongoDB();

/**
 * Connect redis
 */
// require('./startup/redis').connectRedis();

app.use(contextService.middleware('request'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
// console.log("headeres",req.headers)
    if (!(['admin'].includes(req.headers['x-portal'])) && !req.path.includes('documentation')) {
        next(new Error('In-proper Request'));
    } else {
        global.isAdminPortal = (req.headers['x-portal'] === 'admin');

        next();
    }
});
app.use((req,res,next)=>{
    next();
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
    if (res.headersSent) {
        return next(error);
    }
    console.log(error)
    const status = error.status || 500;
    const message = process.env.NODE_ENV === 'prod' ? 'Internal Server Error' : error.message;
    // Log the error
    logger.error(`Error: ${status} - ${message} - ${req.method} ${req.url}`);
    
    return res.status(status).json({ success: false, message });
});

module.exports = app;
