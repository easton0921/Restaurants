const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

async function createStripeCustomer(user) {
    const customer = await stripe.customers.create({
        email: user.email
    })
    user.stripeId = customer.id
    await User.save()
    return customer.id
}
async function paymentLink(amount, currency, productName) {
    const price = await stripe.prices.create({ unit_amount: amount, currency: currency, product_data: { name: productName } })
    const paymentLink = await stripe.paymentLinks.create({ line_items: [{ price: price.id, quantity: 1 }], })
    return paymentLink.url
}
async function checkoutSession(amount, currency, productName) {
    const price = await stripe.prices.create({ unit_amount: amount, currency: currency, product_data: { name: productName } })
    const session = await stripe.checkout.sessions.create({
        line_items: [{ price: price.id, quantity: 1 }],
        mode: "payment",
        success_url: "https://yourwebsite.com/success",
        cancel_url: "https://yourwebsite.com/cancel"
    })
    return session
}
async function paymentIntent(amount, currency) {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        automatic_payment_methods: {
            enabled: true
        }
    });
    return paymentIntent
}
// subscription---------------------------------------------
async function createStripeProduct(subscription) {
    try {
        product = await stripe.products.create({
            name: subscription.name,
            description: `Subscription for ${subscription.name} plan.`,
            metadata: {
                subscription: subscription._id.toString()
            }
        })
        const price = await stripe.prices.create({
            unit_amount: subscription.amount*100,
            currency: subscription.currency,
            product: product.id,
            recurring: {
                interval: 'day',
                interval_count: subscription.validity
            },
            metadata: { subscription: subscription._id.toString() }
        })
        subscription.priceId = price.id
        subscription.productId = product.id
        subscription.currency = price.currency
        subscription.duration = price.recurring.interval
        subscription.subscriptionStatus = price.type
        await subscription.save()
        return subscription
    }
    catch (error) {
        console.log("error in subscription and product function", error)
        throw error;
    }
}

async function createSubscriptionPaymentLink(subscription, user) {
    
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: subscription.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: "https://yourwebsite.com/successUrl",
        cancel_url: 'https://yourwebsite.com/cancel',
        customer: user.stripeCustomerId,
        metadata: {
            subscriptionId: subscription._id.toString(),
            userId: user._id.toString()
        }
    })
    console.log('hgfds', session.id)
    return session

}


module.exports = { createStripeCustomer, paymentLink, checkoutSession, paymentIntent, createStripeProduct, createSubscriptionPaymentLink }