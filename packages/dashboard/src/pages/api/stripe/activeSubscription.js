import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const stripeCustomerId = "cus_J09ECKPgFEPXoq";
    const stripeCustomer = await stripe.customers.retrieve(stripeCustomerId);
    const { subscriptions } = stripeCustomer;

    res.json(subscriptions);
  } catch ({ message }) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
  }
};
