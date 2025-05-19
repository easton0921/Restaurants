const algorithm = process.env.ENCRPTION_ALGORITHM;
let iv = process.env.QR_ENCRPTION_IV;
const key = process.env.QR_ENCRPTION_KEY;


// Helper function for encrypting with the crypto module
const encryptWithCrypto = (data, encryptionKey, encryptionIv) => {
    const cipher = Crypto.createCipheriv(algorithm, Buffer.from(encryptionKey, 'base64'), Buffer.from(encryptionIv, 'base64'));
    let encrypted = cipher.update(JSON.stringify(data));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {
        hash: encrypted.toString('hex'),
        iv: encryptionIv,
    };
};

// Helper function for encrypting with CryptoJS
const encryptWithCryptoJS = (data, encryptionKey, encryptionIv) => {
    const keyWEB = CryptoJS.SHA256(encryptionKey);
    const ivWEB = CryptoJS.enc.Base64.parse(encryptionIv);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), keyWEB, {
        iv: ivWEB,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
};

// Main encryption function for WEB ANGULAR
const encryptionWithCryptoJS = (data) => {
    try {
        const encryptedData = encryptWithCryptoJS(data, key, iv);
        return { hash: encryptedData, iv: iv };
    } catch (error) {
        console.error('Error in encryptionWithCryptoJS:', error);
        throw new Error('Encryption failed');
    }
};

// Main encryption function for other device types
const encryptionWithCrypto = (data) => {
    try {
        return encryptWithCrypto(data, key, iv);
    } catch (error) {
        console.error('Error in encryptionWithCrypto:', error);
        throw new Error('Encryption failed');
    }
};

// Wrapper function for handling different device types
const encryptData = (data, deviceType) => {
    if (deviceType === 'web_angular') {
        return encryptionWithCryptoJS(data);
    } else {
        return encryptionWithCrypto(data);
    }
};

module.exports = {
    encryptWithCrypto,
    encryptWithCryptoJS,
    encryptionWithCrypto,
    encryptionWithCryptoJS,
    encryptData,
};