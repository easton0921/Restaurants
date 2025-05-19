
const Schema = new Mongoose.Schema({
    otpType: { type: Number, enum: Object.values(constants.OTP_TYPE) },
    code: { type: String },
    phone: { type: String },
    countryCode: { type: String, trim: true },
    email: { type: String },
    expiredAt: { type: Date }
  }, { timestamps: true });
  
  // Automatically delete records after `expiredAt`
  Schema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
  
  Schema.pre(/save|create|update/i, async function (next) {
    const doc = this;
  
    // remove otp old otp for same doc
    const deleteQry = { otpType: doc.otpType };
  
    if (doc.email) {
      deleteQry.email = doc.email;
    } else if (doc.phone && doc.countryCode) {
      deleteQry.phone = doc.phone;
      deleteQry.countryCode = doc.countryCode;
    }
    await Model.Otp.deleteMany(deleteQry);
  
    const otpExpiresTime = Config.get("App").otpExpiresTime; //1m
    const otpRec = {
      // code: Func.generateNumber(4), TODO
      code: "1234",
      expiredAt: Func.getExpireDate(otpExpiresTime)
    };
  
    this.set(otpRec);
  
    // Send otp email
    if (doc.email) {
      let otpType = "Signup";
      if (constants.OTP_TYPE.LOGIN == doc.otpType) {
        otpType = "Login";
      } else if (constants.OTP_TYPE.FORGET == doc.otpType) {
        otpType = "Forgot password";
      }
  
      const msgObj = {
        to: [doc.email],
        subject: MSG.SUBJECT_OTP,
        message: Email_Template.otp("", otpType, otpRec.code)
      };
  
      Services.Email.send(msgObj);
    }
  
    // TODO: Send otp message
    if (doc.phone && doc.countryCode) {
      let otpType = "Signup";
      if (constants.OTP_TYPE.LOGIN == doc.otpType) {
        otpType = "Login";
      } else if (constants.OTP_TYPE.FORGET == doc.otpType) {
        otpType = "Forgot password";
      }
      const message = `Your one time code for ${otpType} in Mitra app is ${otpRec.code}`;
      // Services.SmsService.sendSMSTwillo(doc.countryCode,doc.phone,message)
    }
  
    next();
  });
  
  module.exports = Mongoose.model('otp', Schema);