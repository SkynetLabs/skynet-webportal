import ky from "ky/umd";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import { isPaidTier } from "../../../services/tiers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getStripeCustomer = async (user, authorization) => {
  if (user.stripeCustomerId) {
    return stripe.customers.retrieve(user.stripeCustomerId);
  }

  const customer = await stripe.customers.create();

  // update user instance and include the customer id once created
  await ky.put(`http://accounts:3000/user`, { headers: { authorization }, json: { stripeCustomerId: customer.id } });

  return customer;
};

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(StatusCodes.NOT_FOUND).end();
  }

  const { price } = req.body;

  if (!price) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: "Missing 'price' attribute" } });
  }

  try {
    const authorization = req.headers.authorization; // authorization header from request
    const user = await ky("http://accounts:3000/user", { headers: { authorization } }).json();

    if (isPaidTier(user.tier)) {
      const message = `Customer can have only one active subscription at a time, use Stripe Customer Portal to manage active subscription`;

      return res.status(StatusCodes.BAD_REQUEST).json({ error: { message } });
    }

    const customer = await getStripeCustomer(user, authorization);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price, quantity: 1 }],
      customer: customer.id,
      client_reference_id: user.sub,
      allow_promotion_codes: true,
      success_url: `${process.env.SKYNET_DASHBOARD_URL}/payments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SKYNET_DASHBOARD_URL}/payments`,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: { message: error.message } });
  }
};
