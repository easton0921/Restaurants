const categorySchema = new Mongoose.Schema({
    name:{
        type:String,
       
    },
    description: {
        type: String,
        default: ''
      },
    image: {
        type: String,   
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default:false,
    }
}, { timestamps: true },)


module.exports = Mongoose.model("category",categorySchema)