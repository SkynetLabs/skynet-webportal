import got from "got";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const authorization = req.headers.authorization; // authorization header from request
    const user = await got("http://accounts:3000/user", { headers: { authorization } });
    console.log(user);
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.SKYNET_DASHBOARD_URL}/payments`,
    });

    res.redirect(session.url);
  } catch ({ message }) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
  }
};
