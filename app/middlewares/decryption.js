const algorithm = process.env.ENCRPTION_ALGORITHM;
let iv = process.env.ENCRPTION_IV;
const key = process.env.ENCRPTION_KEY;


// Helper function for validating headers (hash, sek, devicetype)
const validateHeaders = (req, res) => {
    const { hash, sek, devicetype } = req.headers;
    if (!hash || !devicetype) {
        res.status(429).send({ message: "Invalid Request", data: {} });
        return false;
    }
    return true;
};

// Helper function for validating request body
const validateBody = (req, res) => {
    if (Object.keys(req.body).length > 0 && !req.body.hash) {
        res.status(429).send({ message: "Invalid Request", data: {} });
        return false;
    }
    return true;
};

// Helper function for validating date
const isDateValid = (date, thresholdInSeconds = 30) => {
    return Moment(date).isValid() && Moment().diff(Moment(date), "s") < thresholdInSeconds;
};

// Helper function for decrypting with crypto module
const decryptWithCrypto = (hash, sek, iv) => {
    hash = Buffer.from(hash, 'hex');
    const decipher = Crypto.createDecipheriv(algorithm, Buffer.from(hash, 'base64'), iv);
    let decrypted = decipher.update(Buffer.from(sek, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return JSON.parse(decrypted.toString());
};

// Helper function for decrypting with CryptoJS
const decryptWithCryptoJS = (hash, iv, key) => {
    const keyWEB = CryptoJS.SHA256(key);
    const ivWEB = CryptoJS.enc.Base64.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(hash, keyWEB, {
        iv: ivWEB,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};

// Main decryption function for WEB ANGULAR
async function decryptionWithCryptoJS(req, res, next) {
    // if (isAppValid(req)) return next();
    if (!validateHeaders(req, res)) return;

    try {
        const decryptedData = decryptWithCryptoJS(req.headers.hash, iv, key);
        const decryptedDate = decryptedData.date;

        if (!isDateValid(decryptedDate, 15)) {
            return res.status(429).send({
                statusCode: 429,
                message: "BLOCKED ACCESS",
                data: {},
                status: 0,
                isSessionExpired: true,
            });
        }

        req.headers = decryptedData;

        if (!validateBody(req, res)) return;

        if (Object.keys(req.body).length > 0) {
            req.body = decryptWithCryptoJS(req.body.hash, iv, key);
            delete req.body.date;
        }
        next();
    } catch (error) {
        console.error('Error in secKeyDecryptedWithSekForWEB:', error);
        return res.status(429).send({
            statusCode: 429,
            message: "Invalid Request",
            data: {},
        });
    }
}

// Main decryption function for other device types
async function decryptionWithCrypto(req, res, next) {
    // if (isAppValid(req)) return next();
    if (!validateHeaders(req, res)) return;

    try {
        const { hash, sek } = req.headers;

        const decryptedHeaders = decryptWithCrypto(hash, sek, iv);

        if (!isDateValid(decryptedHeaders.date)) {
            return res.status(429).send({ message: "Invalid Request*", data: {} });
        }

        req.headers = decryptedHeaders;
        console.log('decryptedHeaders:-------- ', decryptedHeaders);

        if (!validateBody(req, res)) return;
        if (Object.keys(req.body).length > 0) {
            req.body = decryptWithCrypto(req.body.hash, req.body.sek, iv);
            delete req.body.date;
        }
        next();
    } catch (error) {
        console.error('Error in secKeyDecryptedWithSek:', error);
        return res.status(429).send({ message: "Invalid Request", data: {} });
    }
}

// Wrapper function for handling different device types
async function  decrypWithSek(req, res, next) {
    try {
        console.log('req.headers: ', req.headers);
        if (req.headers.devicetype === "web_angular") {
            await decryptionWithCryptoJS(req, res, next);
        } else {
            await decryptionWithCrypto(req, res, next);
        }
    } catch (error) {
        console.error('Error in decrypWithSek:', error);
        return res.status(429).send({ message: "Invalid Request", data: {} });
    }
}

// Helper function for checking non-secret API requests
async function withoutEncryptionApi(req) {
    return req.originalUrl.includes('/media') || req.originalUrl.includes('/checkUserName') || req.originalUrl.includes('/webhook')
        || req.originalUrl.includes('/core/documentation') || req.originalUrl.includes('/admin/documentation');
}


module.exports = {
    decryptionWithCrypto,
    decrypWithSek,
    decryptionWithCryptoJS,
    withoutEncryptionApi
};
