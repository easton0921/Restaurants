const functions = require("../utils/functions");

const findMessage = async (arr, lang) => {
    if (!Array.isArray(arr) || arr.length === 0) return ""; // Ensure arr is valid
    const matchedElement = arr.find(element => element.lang === lang);
    return matchedElement ? functions.prettyCase(matchedElement.value) : functions.prettyCase(arr[0].value);
};

//JSON validation
const isValidJSON = (str) => typeof str === "string" && str.startsWith("{") && str.endsWith("}") && (() => {
    try { JSON.parse(str); return true; } catch { return false; }
})();

module.exports = (req, res, next) => {
    /**
     * @desc Sends a success response
     * @param {string} message - Success message
     * @param {Object} [data={}] - Response data
     */
    res.success = (message, data = {}) => {
        return res.status(200).send({
            statusCode: 200,
            message: functions.prettyCase(message),
            data,
            status: 1
        });
    };

    /**
     * @desc Sends an error response
     * @param {number} code - HTTP status code
     * @param {string|Object} message - Error message or message object
     * @param {Object} [data={}] - Additional data
     * @param {number} [errCode=0] - Custom error code
     */
    res.error = async (code = 400, message, data = {}, errCode = 0) => {
        try {
            if (typeof message === "object") {
                message = await findMessage(message, process.env.LANG);
            } else if (isValidJSON(message)) {
                message = await findMessage(JSON.parse(message), process.env.LANG);
            }

            return res.status(code).send({
                statusCode: code,
                message: typeof message === "string" ? message : "An unexpected error occurred",
                data,
                status: 0,
                isSessionExpired: code === 401,
                errCode,
                lang: process.env.LANG
            });

        } catch (error) {
            console.error("Error in res.error handler:", error);
            return res.status(500).send({
                statusCode: 500,
                message: "Internal Server Error",
                data: {},
                status: 0
            });
        }
    };

    next();
};
