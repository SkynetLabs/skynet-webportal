import got from "got";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const authorization = req.headers.authorization; // authorization header from request
    const { stripeCustomerId } = await got("http://accounts:3000/user", { headers: { authorization } }).json();
    const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
    // const { subscriptions } = stripeCustomer;

    res.json(stripeCustomer);
  } catch ({ message }) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
  }
};
