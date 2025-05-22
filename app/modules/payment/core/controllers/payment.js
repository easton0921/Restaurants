const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser');

//payment intent=============================================================================================
const paymentIntent = async (req, res, next) => {
    try {
        console.log("create paymentIntent router working")
        const { data, message } = await Services.payment.paymentIntent(req.body)
        return res.success(message, data)
    } catch (error) {
        console.log('error in payment intent create router', error)
        next(error)
    }
};

//payment checkout session====================================================================================
const checkoutSession = async (req, res, next) => {
    try {
        console.log("create user and check out session  router working")
        const { data, message } = await Services.payment.createUserAndCheckoutSession(req.body)
        return res.success(message, data)
    } catch (error) {
        console.log('error in checkoutsession create router', error)
        next(error)
    }
};

//payment link====================================================================================================
const paymentLink = async (req, res, next) => {
    try {
        console.log("create payment link router working")
        const { data, message } = await Services.payment.paymentLink(req.body)
        return res.success(message, data)
    } catch (error) {
        console.log('error in payment link create router', error)
        next(error)
    }
};

//payment for subscription=============================================================================================
const subscription = async (req, res, next) => {
    try {
        console.log("createsubscription router working")
        const { data, message } = await Services.payment.subscription(req.body)
        return res.success(message, data)
    } catch (error) {
        console.log('error in subscription create router', error)
        next(error)
    }
};

//payment for subscription=============================================================================================
const SubscriptionPaymentLink = async (req, res, next) => {
    try {
        console.log("createsubscription router working")
        const { data, message } = await Services.payment.createSubscriptionPaymentLink(req.body)
        return res.success(message, data)
    } catch (error) {
        console.log('error in subscription payment link create router', error)
        next(error)
    }
};

// webhook===================================================================================================
const webhook = async (req, res, next) => {
    try {
        console.log("webhook router working")
        const { data, message } = await Services.payment.handleWebhook(req)
        return res.success(message, data)
    } catch (error) {
        console.log('error in webhook router', error)
        next(error)
    }
};


router.post("/",Validator(Validations.Payment.paymentIntent),paymentIntent),


router.post("/CheckoutSession",Validator(Validations.Payment.paymentCheckOut),checkoutSession)


router.post("/paymentLink",Validator(Validations.Payment.paymentLink), paymentLink)


router.post("/subscription",Validator(Validations.Payment.subscription),subscription)

router.post("/subscriptionPaymentLink", Validator(Validations.Payment.subscriptionPymaneLink), SubscriptionPaymentLink)


router.post("/webhook", bodyParser.raw({ type: "application/json" }),webhook);



module.exports = router