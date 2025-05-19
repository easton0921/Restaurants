
const Schema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    jti: { type: String, index: true },
    deviceType: { type: String, enum: Object.values(constants.DEVICETYPE) },
    deviceToken: { type: String, index: true },
    expiresAt: { type: Date }
  }, { timestamps: true });
  
  // Token cleanup middleware (optional): Automatically remove expired tokens
  Schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  
  Schema.pre(/save|create|update/i, async function (next) {
    const tokenExpiresTime = Config.get("App").tokenExpiresTime; // 24h
    this.set({ expiresAt: Func.getExpireDate(tokenExpiresTime) });
  
    // try {
    //   const user = await Model.User.findById(this.userId);
    //   if (user) {
    //     user.loginCount += 1;
    //     await user.save();
    //   }
  
    //   next();
    // } catch (err) {
    //   next(err);
    // }
  });
  
  module.exports = Mongoose.model('sessions', Schema);
  
  module.exports.tokensList = async (userIds) => {
    try {
      const sessions = await dbHelper.find(
        Model.Sessions,
        { userId:{ $in: userIds }, expiresAt: { $gt: new Date() }, deviceToken: { $exists: true, $ne: "" }}, 
        {deviceToken:1}
      )
  
      const deviceTokens = sessions.map(session => session.deviceToken);
      return deviceTokens; 
      
    } catch (err) {
      console.error('Error fetching sessions:', err);
      throw err;
    }
  };