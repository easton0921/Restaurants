const addressSchema = new Mongoose.Schema({
    userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    PostalCode: { type: Number },
    country: { type: Number, enum: Object.values(constants.COUNTRY_TYPE) },
    addressLabel: { type: Number, enum: Object.values(constants.ADDRESS_LABEL) },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false }
},
    { timestamps: true },)
module.exports = Mongoose.model("address", addressSchema)