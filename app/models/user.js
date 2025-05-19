
const bcrypt = require("bcryptjs");

const Schema = new Mongoose.Schema({
  // referenceId: { type: String },
  role: { type: Number, enum: Object.values(constants.ROLE), default: constants.ROLE.USER },
  accessRole: { type: Mongoose.Schema.Types.ObjectId, ref: "access_roles" },
  image: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String },
  bio: { type: String },
  dob: { type: Date },
  email: { type: String, trim: true, lowercase: true, index: true },
  password: { type: String },
  phone: { type: String },
  countryCode: { type: String },
  isoCode: { type: String },
  isPhoneVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  isProfileCompleted: { type: Boolean, default: false },
  qrImage: { type: String },
  location: { type: String },
  qualification: { type: String },
  gender: { type: Number, enum: Object.values(constants.GENDER) },
  isNotification: { type: Boolean, default: false },
  stripeCustomerId: { type: String },





  // stripeCustomerId: { type: String },
  // stripeSubscriptionId: { type: String },
  // subscriptionPlanId: { type: Mongoose.Schema.Types.ObjectId, ref: "subscription" },
  // isSubscribed: { type: Boolean, default: false },
  // subscriptionStatus: { type: Number, enum: Object.values(constants.SUBSCRIPTION_STATUS), default: constants.SUBSCRIPTION_STATUS.INACTIVE },
  // subscriptionExpiryDate: { type: Date },

  // socialType: { type: Number, enum: Object.values(constants.SOCIAL_TYPE) },
  // socialId: { type: String },
  // isSocialLogin: { type: Boolean, default: false },

  // bgImage: { type: String },
  // instagram: { type: String },
  // linkedin: { type: String },
  // youTube: { type: String },
  // snapchat: { type: String },
  // tikTok: { type: String },
  // xUrl: { type: String },
  // facebook: { type: String },
  // description: { type: String },

  isBlocked: { type: Boolean, default: false, index: true },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

Schema.virtual('addresses', {
  ref: 'address',
  localField: '_id',
  foreignField: 'userId',
});



// (Optional) Automatically remove deleted record after 30 days
// Schema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

Schema.pre(/save|create/i, async function (next) {

  if (this.isModified("password")) {
    const password = this.get("password");
    const hashPwd = bcrypt.hashSync(password, 10);

    // (optional) Remove sessions on password change
    // await Model.Sessions.deleteMany({ userId: this.get("_id") });

    this.set({ password: hashPwd });
  }


  if (this.isModified("isDeleted")) {
    this.set({ deletedAt: new Date() });
  }

  // remove login sessions when delete or block user
  if (this.isModified("isBlocked") || this.isModified("isDeleted")) {
    await Model.Sessions.deleteMany({ userId: this.get("_id") });
  }

  next();
});

Schema.pre(/update/i, async function (next) {
  if (this._update.password) {
    const password = this._update.password;
    const hashPwd = await bcrypt.hashSync(password, 10);

    // (optional) Remove sessions on password change
    // await Model.Sessions.deleteMany({ userId: this.get("_id") });

    this.set({ password: hashPwd });
  }

  if (this._update.longitude && this._update.latitude) {
    const longitude = this._update.longitude;
    const latitude = this._update.latitude;
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    this.set({ location });
  }

  if (this._update.isDeleted) {
    this.set({ deletedAt: new Date() });
  }

  // remove login sessions when delete or block user
  if (this._update.isBlocked || this._update.isDeleted) {
    await Model.Sessions.deleteMany({ userId: this.get("_id") });
  }

  if (this._update.documentStatus) {
    await Model.Documents.updateMany({ userId: this.get("_id") }, { documentStatus: this.documentStatus, rejectedReason: this.rejectedReason });
  }

  next();
});

// Method to validate password
Schema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

const User = Mongoose.model('users', Schema);
module.exports = User

module.exports.getUser = (id, qry = {}, extraSelect = {}) => {
  return User.findOne({ _id: id, isDeleted: false, ...qry })
    .select({


      firstName: 1,
      lastName: 1,
      dateOfBirth: 1,
      image: 1,
      email: 1,
      countryCode: 1,
      phone: 1,
      isBlocked: 1,
      role: 1,
      isProfileCompleted: 1,
      isPhoneVerified: 1,
      isEmailVerified: 1,
      ...extraSelect
    });
};

module.exports.updateById = (id, data) => {
  return User.findByIdAndUpdate(id, data, { new: true });
};

module.exports.list = (filter, skip, limit) => {
  const pipeline = [];
  const addFields = {};

  const qry = {
    isDeleted: false,
    isProfileCompleted: true
  };

  if (filter?.role) {
    qry.role = Number(filter.role);
  }

  // Add search criteria
  if (filter?.search) {
    const trimmedSearch = filter.search.trim();
    const escapeRegex = (text) => text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const safeSearch = escapeRegex(trimmedSearch);
    const searchRegex = { $regex: safeSearch, $options: 'i' };
    qry.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { userName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
  }

  pipeline.push(
    { $match: qry },
    { $sort: { createdAt: -1 } }
  );

  pipeline.push(
    {
      $project: {
        password: 0
      }
    }
  );

  if (skip !== undefined && limit !== undefined) {
    pipeline.push(...Func.pagination(skip, limit));
  }

  return dbHelper.aggregate(User, pipeline).then(res => {
    if (skip !== undefined && limit !== undefined) {
      return res[0]
    }
    return res;
  });
};