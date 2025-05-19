const productSchema = new Mongoose.Schema({
    name: { type: String, trim: true },
    price: { type: Number, required: true },
    description: { type: String },
    images: [String], 
    categoryId: { type: Mongoose.Schema.Types.ObjectId, ref: 'category'},
    subCategoryId: { type: Mongoose.Schema.Types.ObjectId, ref: 'subcategory'},
    createdBy: {type: Mongoose.Schema.Types.ObjectId,ref: "users"},
    stock: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false},
})
module.exports = Mongoose.model("product",productSchema)