import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const updateSubscription = async (id, body) => {
  const { result: subscriptionsResponse } = await client.subscriptionsApi.updateSubscription(id, body);
  const { subscription } = subscriptionsResponse;

  return subscription;
};

const getActiveCanceledSubscription = async (customerId) => {
  // create subscriptions search query
  const query = { filter: { customerIds: [customerId] } };

  // query subscriptions with given search criteria
  const { result: subscriptionsResponse } = await client.subscriptionsApi.searchSubscriptions({ query });
  const { subscriptions } = subscriptionsResponse;

  // get active subscription with a set cancellation date
  return subscriptions.find(({ status, canceledDate }) => status === "ACTIVE" && canceledDate);
};

const api = {
  POST: async (req, res) => {
    try {
      const user = "NBE7TRXZPGZXNBD64JB6DR5AGR"; // req.headers["x-user"];
      const subscription = await getActiveCanceledSubscription(user);

      if (!subscription) {
        return res.status(StatusCodes.BAD_REQUEST).end(); // no active subscription with cancel date found
      }

      // update the subscription setting empty canceledDate
      const updatedSubscription = await updateSubscription(subscription.id, {
        subscription: { ...subscription, canceledDate: "" },
      });

      return res.json(updatedSubscription);
    } catch (error) {
      console.log(error.errors);

      return res.status(StatusCodes.BAD_REQUEST).end(); // todo: error handling
    }
  },
};

export default (req, res) => {
  if (req.method in api) {
    return api[req.method](req, res);
  }

  return res.status(StatusCodes.NOT_FOUND).end();
};
