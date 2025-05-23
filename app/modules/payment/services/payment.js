const moment = require('moment');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


exports.paymentIntent = async (body) => {
  try {
    const {
      name,
      email,
      amount,
      currency = 'usd',
      paymentMethodId
    } = body;


    if (!user) {
      const customer = await stripe.customers.create({ name, email });
      user = await Model.User.create({
        name,
        email,
        stripeCustomerId: customer.id
      });
    }

    if (user && !user.stripeCustomerId) {
      const customer = await stripe.customers.create({ name, email });
      user.stripeCustomerId = customer.id;
      await user.save(); 
    }


    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      confirm: true,
      description: `One-time charge for ${email}`,
      payment_method_types: ['card'],
    });

    return {
      data: {
        clientSecret: paymentIntent.client_secret,
        userId: user._id,
        paymentIntentId: paymentIntent.id
      },
      message: "Payment successful"
    };

  } catch (error) {
    console.error("❌ Payment error:", error.message);
    throw error;
  }
};

exports.createUserAndCheckoutSession = async (body) => {
  try {
    const {
      name,
      email,
      amount,
      currency = 'usd',
    } = body;



    let user = await Model.User.findOne({ email });

    if (!user) {
      const customer = await stripe.customers.create({ name, email });
      user = await Model.User.create({
        name,
        email,
        stripeCustomerId: customer.id
      });
    }

    const lineItems = [{
      price_data: {
        currency,
        product_data: {
          name: `Charge for ${email}`,
        },
        unit_amount: amount,
      },
      quantity: 1,
    }];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer: user.stripeCustomerId,
      line_items: lineItems,
      success_url: "https://yourwebsite.com/success",
      cancel_url: "https://yourwebsite.com/cancel"
    });

    return {
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        userId: user._id
      },
      message: "Checkout session created"
    };

  } catch (error) {
    console.error("❌ Checkout session error:", error.message);
    throw error;
  }
};

exports.paymentLink = async (body) => {
  try {
    const price = await stripe.prices.create({
      unit_amount: body.amount,
      currency: body.currency,
      product_data: {
        name: "food",
      },
    });

    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
    });

    return {
      data: paymentLink.url,
      message: "data fetch successfully"
    }
  } catch (error) {
    console.log("error in payment link function ", error)
    throw error
  }
}



exports.subscription = async (body) => {
  console.log('working subscription')
  try {
    const { name, amount, currency } = body

    let obj = {
      name: name,
      amount: amount,
      currency: currency
    }
    const data = new Model.Subscription(obj)
    const subscription = await data.save()
    console.log('subscription: ', subscription);
    await Services.stripe.createStripeProduct(subscription);
    console.log('subscription: ', subscription);

    return {
      data: subscription,
      message: "DATA_SUBMITED_SUCCESSFULLY"
    }
  } catch (error) {
    console.log("error in subscription function", error)
    throw error;
  }
};


exports.createSubscriptionPaymentLink = async (body) => {
  try {
    const { subscriptionId } = body
    const email = body.email
    let user = await Model.User.findOne({ email });

    if (!user) {
      const customer = await stripe.customers.create({ name: body.name, email });
      user = await Model.User.create({
        fullName: body.name,
        email: body.email,
        stripeCustomerId: customer.id
      });
    }

     if (user && !user.stripeCustomerId) {
      const customer = await stripe.customers.create({ name:user.name, email });
      user.stripeCustomerId = customer.id;
      await user.save(); 
    }

    let subscription = await Model.Subscription.findOne({ _id: subscriptionId })

    if (!subscription) { throw new Error("Subscription not found.") }

    let data = await Services.stripe.createSubscriptionPaymentLink(subscription, user);

    //     const sessionDetails = await stripe.checkout.sessions.retrieve(data.id, {
    //       expand: ['subscription']
    //     });
    // console.log("session data ",sessionDetails)
    //    const stripeSubscriptionId = sessionDetails.subscription;
    // if (!stripeSubscriptionId) throw new Error("Stripe subscription ID not found in session.");

    //     console.log("Stripe Subscription ID:", stripeSubscriptionId);

    //     await stripe.subscriptions.update(stripeSubscriptionId, {
    //       cancel_at: Math.floor(Date.now() / 1000) + 86400 
    //     });
    return {
      data: { paymentLink: data.url },
      message: "Payment link created successfully",
    }
  } catch (error) {
    console.log("Error is subscription payment link:", error);
    throw error
  }
}




exports.handleWebhook = async (req) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    const rawBody = req.rawBody || req.body;
    console.log('rawBody:---------- ', rawBody);
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.async_payment_failed':
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        console.log('checkoutSessionAsyncPaymentFailed: ', checkoutSessionAsyncPaymentFailed);
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log('checkoutSessionAsyncPaymentSucceeded: ', checkoutSessionAsyncPaymentSucceeded);
        break;
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
       // await updateSubscriptionStatus(checkoutSessionCompleted);
        break;
      case 'checkout.session.expired':
        const checkoutSessionExpired = event.data.object;
        console.log('checkoutSessionExpired: ', checkoutSessionExpired);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return event;
  } catch (error) {
    throw error;
  }
}











// Message Sumit Singh









// Shift + Enter to add a new line



// :bell:
// Slack needs your permission t