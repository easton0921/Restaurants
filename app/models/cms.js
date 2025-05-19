
const Schema = new Mongoose.Schema({
    email: { type: String },
    countryCode: { type: String },
    phone: { type: String },
    terms: { type: String },
    terms_ar: { type: String },
    privacyPolicy: { type: String },
    privacyPolicy_ar: { type: String },
    aboutUs: { type: String },
    aboutUs_ar: { type: String }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

module.exports = Mongoose.model('cms', Schema);