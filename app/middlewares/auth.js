const jwt = require("jsonwebtoken");

// Get auth token from jwt.
module.exports.getToken = (data) => {
  let tokenRole = "user";
  if (isStaffPortal) {
    tokenRole = "staff";
  } else if (isAdminPortal) {
    tokenRole = "admin";
  }

  data.role = tokenRole;

  return jwt.sign(data, Config.get("App").jwtSecret, {
    expiresIn: '24h'
  });
};

// Get temp auth token valid for 2hrs.
module.exports.getVerifyToken = (data) =>
  jwt.sign(data, Config.get("App").jwtSecret, {
    expiresIn: Config.get("App").tokenExpiresTime
  });

// Verify auth token using jwt.
module.exports.verifyToken = (token) =>
  jwt.verify(token, Config.get("App").jwtSecret);

/**
 * Middleware to verify authentication using JWT and user roles.
 * @param {...string} args - List of roles to authorize (e.g., "admin", "user").
 * @returns {Function} Middleware function for authentication and authorization.
 */
module.exports.verify = (...args) => async (req, res, next) => {
  try {
    /**
     * Parse the roles passed as arguments, validate them, and map them to constants.
     * Removes null or invalid roles and filters roles based on application constants.
     */
    const roles = [].concat(args)
      .filter((role) => !!role && !!role.toString().trim()) // remove null, " " from array
      .map((role) => constants.ROLE[role.toUpperCase()])
      .filter((role) => !!role); // remove if not match ROLE

    const token = String(req.headers.authorization || "")
      .replace(/bearer|jwt|Guest/i, "")
      .trim();
    // const token = String(req.headers['x-token'] || "").trim();

    if (!token) {
      console.error("No token");
      return res.status(401).send({
        "statusCode": 401,
        "message": MSG.UNAUTHORIZED_ACCESS,
        "data": {},
        "status": 0,
        "isSessionExpired": true
      });
    }

    const decoded = this.verifyToken(token);

    if (!decoded) {
      console.error("Token decode failed", token);
      return res.status(401).send({
        "statusCode": 401,
        "message": MSG.UNAUTHORIZED_ACCESS,
        "data": {},
        "status": 0,
        "isSessionExpired": true
      });
    }

    const doc = await Model.Sessions.findById(decoded._id).populate("userId");

    if (!doc) {
      console.error("Token user not found", decoded);
      return res.status(401).send({
        "statusCode": 401,
        "message": MSG.UNAUTHORIZED_ACCESS,
        "data": {},
        "status": 0,
        "isSessionExpired": true
      });
    }

    if (doc.userId.isBlocked) {
      console.error("User is blocked", doc.userId);
      return res.status(401).send({
        "statusCode": 401,
        "message": MSG.ACCOUNT_BLOCKED,
        "data": {},
        "status": 0,
        "isSessionExpired": true
      });
    }

    if (!roles.includes(doc.userId.role)) {
      console.error("Access role not match", { expected: roles.join(", "), found: doc.userId.role });
      return res.status(401).send({
        "statusCode": 401,
        "message": MSG.UNAUTHORIZED_ACCESS,
        "data": {},
        "status": 0,
        "isSessionExpired": true
      });
    }

    // (Optional): send resetPassword forcefully in body
    if (decoded.isForget) {
      const whitelistPath = ["/change-password"];

      if (!whitelistPath.includes(req.url)) {
        return res.status(401).send({
          "statusCode": 401,
          "message": MSG.UNAUTHORIZED_ACCESS,
          "data": {},
          "status": 0,
          "isSessionExpired": true
        });
      }
      req.body.resetPassword = true;
    }

    let role
    if (roles.includes(constants.ROLE.ADMIN)) {
      role = "admin";
    } else {
      role = "user";
    }

    // Attach session, userId, and decoded user data to the request object.
    if (role) req[role] = doc.userId.toJSON({ virtuals: true });
    req.session = doc.toJSON({ virtuals: true });
    req.userId = doc.userId._id;
    req.decoded = doc.userId.toJSON({ virtuals: true });

    next();
  } catch (error) {
    console.error(error);
    const message =
      String(error.name).toLowerCase() == "error" ?
        error.message :
        MSG.UNAUTHORIZED_ACCESS;

    return res.error(401, message);
  }
};

/**
 * Middleware to check if a sub-admin has the required permissions for an API action.
 * @param {string} apiType - The type of API action (e.g., "get", "add", "edit", "delete").
 * @param {...number} sideBarIds - List of sidebar IDs to check for permissions.
 * @returns {Function} Middleware function for permission verification.
 */
module.exports.checkSubAdmin = (apiType, ...sideBarIds) => async (req, res, next) => {
  if (![constants.ROLE.SUB_ADMIN].includes(req.decoded.role)) {
    return next();
  }

  let qry = {
    sideBarId: { $in: sideBarIds.map(item => Number(item)) }
  };

  if (apiType == "get") {
    qry.isView = true;
  } else {
    qry.isView = true;

    if (apiType == "delete") {
      qry.isDelete = true;
    } else if (apiType == "add") {
      qry.isAdd = true;
    } else if (apiType == "edit") {
      qry.isEdit = true;
    }
  }


  const checkPermission = await dbHelper.aggregate(Model.AccessRole, [{
    $match: {
      _id: req.decoded.accessRole,
      permission: {
        $elemMatch: qry
      }
    }
  }]);


  if (checkPermission.length > 0) {
    return next();
  }

  throw new Error(MSG.ACCESS_DENIED);
};