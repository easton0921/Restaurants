// const constants = require('./../../config/constants');
// const Model = require('../models/index');
// const functions = require("./../utils/functions");
// // eslint-disable-next-line no-unused-vars

// const twilio = require("twilio");

// var accountSid = Config.get("Twillo").AccountSID; 
// var authToken = Config.get("Twillo").AuthToken;

// const client = twilio(accountSid, authToken, {
//   lazyLoading: true
// });

// module.exports.sendSMSTwillo = async (countryCode,phoneNo,message)=>{
//  const smsOptions = {
//           from: Config.get("Twillo").From,
//           to: (countryCode?countryCode:'') + (phoneNo?phoneNo.toString():''),
//           body: null
//         };
//         smsOptions.body = message;
//       client.messages.create(smsOptions).then(sms => console.log("sending sms "))
//       .catch(error => console.log(error));
// };

// //Send Verification otp. 
// exports.sendPhoneVerification = async (payload) => {
//     try {
//         if (!payload.dialCode) throw new Error(MSG.DIAL_CODE_MISSING);
//         if (!payload.phoneNo) throw new Error(MSG.PHONE_MISSING);
//         payload.otp = process.env.MASTER_OTP || functions.generateNumber(4);
//         const otpTypeMapping = {
//             [constants.VERIFICATION_TYPE.SIGNUP]: "signup_otp",
//             [constants.VERIFICATION_TYPE.LOGIN]: "login_otp",
//             [constants.VERIFICATION_TYPE.PROFILE_UPDATE]: "profile_otp",
//             [constants.VERIFICATION_TYPE.FORGET]: "forgot_otp"
//           };
//           const updatePayload = {
//             [otpTypeMapping[payload.type]]: payload.otp
//           };
//           if(payload.userId)
//           await Model.User.updateOne({_id:payload.userId},{$set:updatePayload},{ new: true });
//           else
//           await Model.User.updateOne({phoneNo:payload.phoneNo,dialCode: payload.dialCode},{$set:updatePayload},{ new: true });
          
//         let payloadData = {
          
//             phoneNo: payload.phoneNo,
//             dialCode: payload.dialCode,
//             message: `Your verification code is ${payload.otp}`,
//             id: "1234",
//             code: payload.otp
//         };
//         await sendSMS(payloadData);
//         return true;
//     } catch (error) {
//         console.error("sendPhoneVerification", error);
//     }
// };