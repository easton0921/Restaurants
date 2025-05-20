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


    let user = await Model.User.findOne({ email });

    if (!user) {
      const customer = await stripe.customers.create({ name, email });
      user = await Model.User.create({
        name,
        email,
        stripeCustomerId: customer.id
      });
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



exports.userSubscription = async (req) => {
  const endpointSecret = process.env.stripe_endpoint_secret;
  let event = req.body;

  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, signature, endpointSecret);
      console.log(" Webhook verified:", event.type);
    } catch (err) {
      console.error(" Webhook verification failed:", err.message);
      throw err;
    }
  }
  const eventData = event.data.object;
  if (!eventData) { throw new Error("event data missing") }

  switch (event.type) {
    case "checkout.session.async_payment_failed":
      console.log(" Async payment failed:", eventData);
      break;

    case "checkout.session.async_payment_succeeded":
      console.log(" Async payment succeeded:", eventData);
      break;

    case "checkout.session.completed":
      console.log(" Checkout session completed:", eventData);
      console.log(" Metadata:", eventData.metadata);
      break;

    case "checkout.session.expired":
      console.log(" Checkout session expired:", eventData);
      break;

    case "payment_link.updated":
      console.log(" Payment link updated:", eventData);
      break;

    default:
      console.warn(` Unhandled event type: ${event.type}`);
  }

  return {
    data: { received: true },
    message: " Stripe webhook processed successfully"
  };
};
