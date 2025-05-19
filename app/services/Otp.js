
exports.verifyEmailCode = async (email, code, otpType, removeOtp = true) => {
    return await Services.Otp.verifyPhoneOtp(null, email, code, otpType, removeOtp, true);
}

exports.verifyPhoneOtp = async (countryCode, key, otpCode, otpType, removeOtp = true, isForEmail = false, userId) => {
    let qry = {
        code: otpCode,
        otpType: otpType,
    };
    if (isForEmail) {
        qry.email = key.toLowerCase();
    } else {
        qry.phone = key;
    }
    if (userId) {
        qry.userId = ObjectId(userId);
    }
    if (countryCode) {
        qry.countryCode = countryCode;
    }
    let otp = await Model.Otp.findOne(qry, { _id: 1, expiredAt: 1 });
    if (!otp) throw new Error(MSG.INVALID_OTP);

    if (otp.expiredAt && otp.expiredAt < new Date()) {
        throw new Error(MSG.OTP_EXPIRED);
    }
    
    if (otp && removeOtp) await Model.Otp.deleteOne({ _id: otp._id });

    return otp;
}