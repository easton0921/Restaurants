const subscriptionSchema = new Mongoose.Schema({
  name: {
        type: String
    },
    amount: {
        type: String
    },
    duration: {
        type: String, 
    },
    cancel_at:{
        type:String
    },
    currency:{
        type: String,
    },
    productId: {
        type: String
    },
    priceId: {
        type: String
    },
    subscriptionStatus: {
        type: String,
        enum: ["active", "trialing", "over", "inComplete","recurring"],
    }
},
    {
        timestamps: true
    })

module.exports = Mongoose.model("subscription", subscriptionSchema)