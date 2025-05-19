const functions = require("./functions");
const findMessage = async (arr, lang) => {
  for (const element of arr) {
    if (element.lang === lang) {
      return functions.prettyCase(element.value);
    }
  }
  return arr[0] ? arr[0].value : ""; // Return "" if no matching item is found
};
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = () => (req, res, next) => {
  // success response
  res.success = (message, data) => {
    message = functions.prettyCase(message);
    return res.send({ statusCode: 200, message, data: data || {}, status: 1 });
  };
  // error resposne
  res.error = async (code, message, data, errCode) => {
    if (typeof message == "object") {
      message = await findMessage(message, process.env.lang);
    }
    if (isValidJSON(message)) {
      message = await findMessage(JSON.parse(message), process.env.lang);
    }
    code = code ? code : 400;
    if (code == 401) {
      return res.status(code).send({
        statusCode: code,
        message,
        data: data || {},
        status: 0,
        isSessionExpired: true,
        errCode: errCode || 0,
        lang: process.env.lang
      });
    } else {
      return res.status(code).send({
        statusCode: code,
        message,
        data: data || {},
        status: 0,
        isSessionExpired: false,
        errCode: errCode || 0,
        lang: process.env.lang
      });
    }
  };
  // proceed forward
  next();
};