const winston = require("winston");
const path = require("path");

// Define custom log levels
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define log colors for development
const customColors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "cyan",
    debug: "gray",
};

// Add colors to Winston (only for development)
if (process.env.NODE_ENV !== "prod") {
    winston.addColors(customColors);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    process.env.NODE_ENV === "prod"
        ? winston.format.json() // JSON format for production
        : winston.format.combine(
              winston.format.colorize({ all: true }), // Enable colors for dev
              winston.format.printf(({ level, message, timestamp }) => {
                  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
              })
          )
);

// Define transports
const transports = [
    new winston.transports.Console({
        level: process.env.NODE_ENV === "prod" ? "warn" : "debug",
    }),
    new winston.transports.File({
        filename: path.join(__dirname, "../logs/error.log"),
        level: "error",
        maxsize: 5 * 1024 * 1024, // 5MB log file size
        maxFiles: 5, // Keep last 5 error logs
    }),
    new winston.transports.File({
        filename: path.join(__dirname, "../logs/combined.log"),
        maxsize: 10 * 1024 * 1024, // 10MB for combined logs
        maxFiles: 10, // Keep last 10 combined logs
    }),
];

// Create the logger
const logger = winston.createLogger({
    levels: logLevels,
    format: logFormat,
    transports,
    exitOnError: false, // Prevent app crashes due to logging errors
});

// Middleware for logging HTTP requests (use with Express)
const httpLogger = winston.createLogger({
    levels: logLevels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: path.join(__dirname, "../logs/http.log"),
            level: "http",
            maxsize: 10 * 1024 * 1024,
            maxFiles: 10,
        }),
    ],
});

// Attach middleware to Express
const requestLogger = (req, res, next) => {
    const logMessage = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
    };
    httpLogger.http(JSON.stringify(logMessage));
    next();
};

// Export the logger and middleware
module.exports = {
    logger,
    requestLogger,
};
