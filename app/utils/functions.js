const _ = require("lodash");
const Handlebars = require("handlebars");
const bcrypt = require("bcryptjs");

module.exports.getExpireDate = (tokenExpiresTime) => {
  const match = tokenExpiresTime.match(/^(\d+)([a-zA-Z]+)$/); // Extract number and unit
  if (!match) throw new Error('Invalid tokenExpiresTime format');
  const value = parseInt(match[1], 10);
  const unit = match[2]; // 'h', 'd', 'm', etc.
  return Moment().add(value, unit).toDate(); // Add duration and convert to JS Date
};

//Helper functions
module.exports.toHex = (val) => Buffer.from(val, "utf8").toString("hex");
module.exports.toStr = (val) => Buffer.from(val, "hex").toString("utf8");
module.exports.generateRandomStringAndNumbers = function (len) {
  let text = _.times(len, () => _.random(35).toString(36)).join('');
  return text;
};
module.exports.setPrecision = async (no, precision) => {
  precision = precision || 2;
  if (!isNaN(no)) {
    return (+(Math.round(+(no + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
  }
  return 0;
};
module.exports.hashPasswordUsingBcrypt = async function (plainTextPassword) {
  try {
    return bcrypt.hashSync(plainTextPassword, 10);
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports.comparePasswordUsingBcrypt = function (pass, hash) {
  try {
    return bcrypt.compareSync(pass, hash);
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error.message);
  }
};
module.exports.prettyCase = (str) => {
  if (typeof str == "string" && /^[A-Z_]+$/.test(str)) {
    str = _.lowerCase(str);
    str = _.startCase(str);
  }
  return str;
};
module.exports.toDecimals = (val, decimal = 2) => {
  const base = Math.pow(10, decimal);
  return Math.round(val * base) / base;
};
module.exports.generateRandomString = (n) => {
  return crypto.randomBytes(n).toString('hex');
},
  module.exports.generateNumber = function (len) {
    let text = _.random(10 ** len, 9 ** len);
    return text;
  };
module.exports.generateRandomCustom = (length) => {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports.generatePassword = () => {
  // Define character sets
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%&*';
  // Ensure the password has at least one character from each required set
  const password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * digits.length)],
    special[Math.floor(Math.random() * special.length)]
  ];
  // Fill the remaining spots in the password to reach the desired length
  const allCharacters = upper + lower + digits + special;
  const remainingLength = 8 - password.length;

  for (let i = 0; i < remainingLength; i++) {
    password.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
  }
  // Shuffle the resulting array to ensure randomness
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  // Convert the array to a string and return it
  return password.join('');
};

module.exports.pagination = (skip, limit) => {
  return [
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 },
        results: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        _id: 0,
        totalCount: 1,
        list: { $slice: ["$results", skip, limit] },
      },
    }
  ];
};
//Render function to frame message and title for notifications
module.exports.renderTemplateField = async (inputKeysObj, values, lang, payloadData) => {
  lang = lang || "en";
  let sendObj = {};
  sendObj.receiverId = payloadData.receiverId ? payloadData.receiverId : null;
  sendObj.driverId = payloadData.driverId ? payloadData.driverId : null;
  sendObj.ticketId = payloadData.ticketId ? payloadData.ticketId : null;
  sendObj.adminId = payloadData.adminId ? payloadData.adminId : null;
  sendObj.time = payloadData.time ? payloadData.time : 0;
  sendObj.bookingId = payloadData.bookingId ? payloadData.bookingId : null;
  sendObj.userId = payloadData.userId ? payloadData.userId : null;
  sendObj.role = payloadData.role ? payloadData.role : constants.ROLE.USER;
  sendObj.isNotificationSave = payloadData.isNotificationSave ? payloadData.isNotificationSave : false;
  sendObj.pushType = payloadData.pushType ? payloadData.pushType : 0;
  if (values) values = JSON.parse(JSON.stringify(values));

  let keys = inputKeysObj.keys || [];
  for (let i = 0; i < keys.length; i++) {
    keys[i].value = values[keys[i].key];
  }
  let source = inputKeysObj.message[lang] || null;
  let template = Handlebars.compile(source) || null;

  let message = template(values) || payloadData.message;
  source = inputKeysObj.title[lang] || null;
  template = Handlebars.compile(source) || null;
  let title = template(values) || payloadData.title;
  sendObj.message = message;
  sendObj.title = title;
  sendObj.keys = keys;
  sendObj.data = values;
  return sendObj;
};

/**
 * Function to check access of subadmin
 * @param {*} req 
 * @returns 
 */
module.exports.checkSubAdmin = async (req) => {
  let isAccess = false;
  if (req.admin && req.admin.role == constants.ROLE.SUBADMIN) {
    let qry = {};
    if (req.admin) {
      qry = {
        sideBarId: Number(req.query.sideBarId),
        role: constants.ROLE.SUBADMIN
      };
    }

    if (req.query.apiType == "get") {
      qry.isView = true;
    } else {
      qry.isView = true;
      if (req.query.apiType == "delete") {
        qry.isDelete = true;
      }
      if (req.query.apiType == "add") {
        qry.isAdd = true;
      }
    }
    let accessRole = (req.admin) ? req.admin.accessRoleId : null;
    let checkPermission = await Model.SubAdminAccess.aggregate([{
      $match: {
        _id: accessRole,
        permission: {
          $elemMatch: qry
        }
      }
    }]);
    if (checkPermission.length > 0) {
      isAccess = true;
      return isAccess;
    }
    return isAccess;
  } else if (req.admin && req.admin.role == constants.ROLE.ADMIN) {
    isAccess = true;
    return isAccess;
  }
};

/**
 * Funtion to add user activity
 * @param {*} data
 * @returns 
 */
module.exports.addUserActivity = async (data) => {
  try {
    return await Model.UserActivity.create(data);
  } catch (err) {
    return err;
  }
}