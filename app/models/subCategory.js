const subCategorySchema = new Mongoose.Schema({
    name:{
        type:String
    },
    categoryId:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true},)

module.exports = Mongoose.model("subcategory",subCategorySchema)