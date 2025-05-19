module.exports.sendOtp = async (body) => {
    try {
        const qry = {
            isDeleted: false
        };
        if (body.email) {
            qry.email = body.email;
            qry.isEmailVerified = true;
        } else if (body.phone) {
            qry.phone = body.phone;
            qry.countryCode = body.countryCode;
            qry.isPhoneVerified = true;
        }

        let role;
        if (isUserPortal) role = constants.ROLE.USER;
        else if (isAdminPortal) role = { $in: [constants.ROLE.ADMIN, constants.ROLE.SUB_ADMIN] };

        if (body.otpType == constants.OTP_TYPE.LOGIN || body.otpType == constants.OTP_TYPE.FORGET) {
            qry.role = role;
        }

        const user = await Model.User.findOne(qry);

        if ([constants.OTP_TYPE.LOGIN, constants.OTP_TYPE.FORGET].includes(Number(body.otpType))) {
            if (!user) throw new Error(MSG.ACCOUNT_NOT_FOUND);
        }
        else if (user && [constants.OTP_TYPE.SIGNUP].includes(Number(body.otpType))) {
            if (body.email) throw new Error(MSG.EMAIL_ALREADY_IN_USE);
            if (body.phone) throw new Error(MSG.PHONE_ALREADY_IN_USE);
        }

        const otp = new Model.Otp(body);
        await otp.save();

        return { data: body, message: MSG.OTP_SENT };
    } catch (error) {
        throw error;
    }
};

/**
* Function to verify otp
* @param {*} body
* @returns 
*/
module.exports.verifyOtp = async (body) => {
    try {
        let otp, user, role;
        const qry = { isDeleted: false };

        body.otpType = Number(body.otpType);

        if (body.email) {
            body.isEmailVerified = true;
            qry.isEmailVerified = true;
            qry.email = body.email;
            otp = await Services.Otp.verifyEmailCode(body.email, body.code, body.otpType);
        } else if (body.phone) {
            body.isPhoneVerified = true;
            qry.isPhoneVerified = true;
            qry.phone = body.phone;
            qry.countryCode = body.countryCode;
            otp = await Services.Otp.verifyPhoneOtp(body.countryCode, body.phone, body.code, body.otpType);
        } else {
            throw new Error(MSG.INVALID_INPUT);
        }

        if (!otp) throw new Error(MSG.INVALID_OTP);

        if (isUserPortal) role = constants.ROLE.USER;
        else if (isAdminPortal) role = { $in: [constants.ROLE.ADMIN, constants.ROLE.SUB_ADMIN] };

        if (body.otpType == constants.OTP_TYPE.LOGIN || body.otpType == constants.OTP_TYPE.FORGET) {
            qry.role = role;
        }
        user = await Model.User.findOne(qry);

        if (body.otpType == constants.OTP_TYPE.LOGIN || body.otpType == constants.OTP_TYPE.FORGET) {
            if (!user) throw new Error(MSG.ACCOUNT_NOT_FOUND);

            if (body.otpType == constants.OTP_TYPE.FORGET && body.password) {
                await dbHelper.findOneAndUpdate(Model.User, { _id: user._id }, { password: body.password });
                await dbHelper.deleteMany(Model.Sessions, { userId: user._id });
                return { data: user, message: MSG.PASSWORD_CHANGED_SUCCESSFULLY };
            }

        } else if (body.otpType == constants.OTP_TYPE.SIGNUP) {
            if (user && body.email) throw new Error(MSG.EMAIL_ALREADY_IN_USE);
            else if (user && body.phone) throw new Error(MSG.PHONE_ALREADY_IN_USE);
            qry.role = body.role;
            // Create new user
            if (body.password) qry.password = body.password;
            let userData = {
                ...qry,
                isEmailVerified: body.isEmailVerified,
                isPhoneVerified: body.isPhoneVerified,
            };
            user = await dbHelper.create(Model.User, userData);
            // user = user.toObject();
        } else {
            throw new Error(MSG.INVALID_INPUT);
        }

        // Delete all previous sessions for the user
        await dbHelper.deleteMany(Model.Sessions, { userId: user._id });

        // Create new session
        let sessionData = {
            deviceType: body.deviceType,
            deviceToken: body.deviceToken,
            jti: Func.generateRandomStringAndNumbers(20),
            userId: user._id
        };
        let session = await dbHelper.create(Model.Sessions, sessionData);

        const result = {
            ...user.toObject(),
            token: Auth.getToken({ _id: session._id, jti: session.jti, isForget: body.otpType == constants.OTP_TYPE.FORGET }),
            tokenType: "Bearer",
            password: undefined
        };

        return { data: result, message: MSG.OTP_VERIFIED };
    } catch (error) {
        throw error;
    }
};

/**
* Function to login with email only
* @param {*} body
* @returns 
*/
module.exports.login = async (body) => {
    try {
        if (isUserPortal) body.role = constants.ROLE.USER;
        else if (isAdminPortal) body.role = { $in: [constants.ROLE.ADMIN, constants.ROLE.SUB_ADMIN] };

        const user = await dbHelper.findOne(Model.User, { email: body.email, isEmailVerified: true, isDeleted: false, role: body.role }).populate("accessRole");
        if (!user) throw new Error(MSG.ACCOUNT_NOT_FOUND);

        if (!user.password) throw new Error(MSG.PASSWORD_NOT_SET);
        const isMatch = await user.comparePassword(body.password);
        if (!isMatch) throw new Error(MSG.INVALID_CREDENTIALS);
        if (user.isBlocked) throw new Error(MSG.ACCOUNT_BLOCKED);

        await dbHelper.deleteMany(Model.Sessions, { userId: user._id });

        let sessionData = {
            deviceType: body.deviceType,
            deviceToken: body.deviceToken,
            jti: Func.generateRandomStringAndNumbers(20),
            userId: user._id
        };
        let session = await dbHelper.create(Model.Sessions, sessionData);

        const result = {
            ...user.toObject(),
            token: Auth.getToken({ _id: session._id, jti: session.jti }),
            tokenType: "Bearer",
            password: undefined
        };

        return { data: result, message: MSG.LOGIN_SUCCESS };
    } catch (error) {
        console.log("login error", error)
        throw error;
    }
};

/**
* Function to change password
* @param {*} user
* @param {*} body
* @returns 
*/
module.exports.changePassword = async (user, body) => {
    console.log(body)
    try {
        const userExist = await dbHelper.findOne(Model.User, { _id: user._id }, { password: 1, isEmailVerified: 1, isBlocked: 1 });
        if (!userExist) throw new Error(MSG.ACCOUNT_NOT_FOUND);
        if (!userExist.isEmailVerified) throw new Error(MSG.EMAIL_NOT_VERIFIED);
        if (userExist.isBlocked) throw new Error(MSG.ACCOUNT_BLOCKED);

        if (!body.resetPassword) {
            if (!userExist.password) throw new Error(MSG.PASSWORD_NOT_SET);
            const isMatch = await userExist.comparePassword(body.oldPassword || "");
            if (!isMatch) throw new Error(MSG.OLD_PASS_NOT_MATCH);

        }
        const isOldSame = await userExist.comparePassword(body.newPassword);
        if (isOldSame) throw new Error(MSG.PASSWORDS_SHOULD_BE_DIFFERENT);

        userExist.password = body.newPassword;
        await userExist.save();
        userExist.password = undefined

        return { message: MSG.PASSWORD_CHANGED_SUCCESSFULLY, data: userExist };
    } catch (error) {
        throw error;
    }
};

/**
* Function to get profile
* @param {*} user
* @returns 
*/
module.exports.getProfile = async (user) => {
    try {
        let result = Object.assign({}, user);
        if (user.role == constants.ROLE.SUB_ADMIN) {
            const accessRole = await dbHelper.findOne(Model.AccessRole, { _id: user.accessRole, isDeleted: false })
            Object.assign(result, { accessRole });
        }

        result.password = undefined;
        return { data: result, message: MSG.DATA_FETCHED };
    } catch (error) {
        throw error;
    }
}

/**
* Function to logout
* @param {*} user
* @returns 
*/
module.exports.logout = async (user) => {
    try {
        let object = Object.assign(user)
        await Model.Sessions.deleteOne({ userId: user._id });
        // object.password=undefined
        return { message: MSG.LOGOUT_SUCCESS, data: "👿" };
    } catch (error) {
        throw error;
    }
}

/**
* Function to update profile
* @param {*} body
* @returns 
*/
module.exports.updateProfile = async (user, body) => {
    console.log(body)
    try {
        if (body.email) {
            let emailExist = await dbHelper.findOne(Model.User, { _id: { $ne: user._id }, email: body.email, isEmailVerified: true, isDeleted: false })
            if (emailExist) throw new Error(MSG.EMAIL_ALREADY_IN_USE);
        }

        if (body.phone) {
            let countryCode = body.countryCode;
            let phoneExist = await dbHelper.findOne(Model.User, { _id: { $ne: user._id }, phone: body.phone, countryCode: countryCode, isPhoneVerified: true, isDeleted: false })
            if (phoneExist) throw new Error(MSG.PHONE_ALREADY_IN_USE);
        }
        if (body.secretPin) {
            body.secretPin = await Func.hashPasswordUsingBcrypt(body.secretPin);
        }

        let userExist = await dbHelper.findOneAndUpdate(Model.User, { _id: user._id, isDeleted: false }, body, { new: true });
        if (!userExist) throw new Error(MSG.ACCOUNT_NOT_FOUND);

        return { data: userExist, message: MSG.PROFILE_UPDATED_SUCCESSFULLY };
    } catch (error) {
        throw error;
    }
}

module.exports.sendOtpToUpdate = async (user, body) => {
    try {
        let qry = { isDeleted: false };

        if (body.email) { qry.email = body.email, qry.isEmailVerified = true }
        else if (body.phone) { qry.phone = body.phone, qry.countryCode = body.countryCode, qry.isPhoneVerified = true }

        qry.userId = { $ne: user._id };
        let userExist = await dbHelper.findOne(Model.User, qry);

        if (userExist && body.email) throw new Error(MSG.EMAIL_ALREADY_IN_USE);
        else if (userExist && body.phone) throw new Error(MSG.PHONE_ALREADY_IN_USE);

        body.userId = user._id;
        const otp = new Model.Otp(body);
        await otp.save();

        return { message: MSG.OTP_SENT_SUCCESSFULLY };
    } catch (error) {
        throw error;
    }
}

module.exports.verifyOtpToUpdate = async (user, body) => {
    try {
        let otp, qry = { isDeleted: false };
        if (body.email) {
            body.isEmailVerified = true;
            qry.isEmailVerified = true;
            qry.email = body.email;
            otp = await Services.Otp.verifyEmailCode(body.email, body.code, body.otpType);
        }
        else if (body.phone) {
            body.isPhoneVerified = true;
            qry.phone = body.phone;
            qry.isPhoneVerified = true;
            qry.countryCode = body.countryCode;
            otp = await Services.Otp.verifyPhoneOtp(body.countryCode, body.phone, body.code, body.otpType);
        }
        if (!otp) throw new Error(MSG.INVALID_OTP)
        const existingUser = await Model.User.findOne(qry);
        if (existingUser) {
            if (body.email) throw new Error(MSG.EMAIL_ALREADY_IN_USE);
            if (body.phone) throw new Error(MSG.PHONE_ALREADY_IN_USE);
        }
        let updatedUser = await Model.User.updateById(user._id, body)
        return { data: updatedUser, message: MSG.OTP_VERIFIED };
    } catch (error) {
        throw error;
    }
}

/**
* Function to delete account
* @param {*} params
* @param {*} body
* @returns 
*/
module.exports.deleteAccount = async (req) => {
    try {
        let qry = { _id: req.user._id, isDeleted: false };
        let body = { isDeleted: true }
        const result = await dbHelper.findOneAndUpdate(Model.User, qry, body);
        if (!result) throw new Error(MSG.INVALID_ID);

        return { message: MSG.ACCOUNT_DELETED_SUCCESSFULLY };
    } catch (error) {
        throw error;
    }
};

module.exports.create = async (user, file, body) => {
    // console.log(file)
    try {
        body.image = `http://localhost:1802/images/${file.filename}`
        body.userId = user._id
        let result = await dbHelper.create(Model.Post, body)
        if (!result) throw new Error(MSG.NOT_FOUND);
        return { data: result, message: MSG.CREATE_SUCCESSFULLY };
    } catch (error) {
        console.log('error: ', error);
        throw error;
    }
};