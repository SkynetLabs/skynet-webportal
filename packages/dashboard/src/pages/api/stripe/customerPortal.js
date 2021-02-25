import got from "got";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getStripeCustomer = (stripeCustomerId = null) => {
  if (stripeCustomerId) {
    return stripe.customers.retrieve(stripeCustomerId);
  }
  return stripe.customers.create();
};

export default async (req, res) => {
  try {
    const authorization = req.headers.authorization; // authorization header from request
    const { stripeCustomerId } = await got("http://accounts:3000/user", { headers: { authorization } }).json();
    const customer = await getStripeCustomer(stripeCustomerId);
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.SKYNET_DASHBOARD_URL}/payments`,
    });

    res.redirect(session.url);
  } catch ({ message }) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
  }
};
