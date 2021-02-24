import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const cancelSubscription = async (id) => {
  const { result: subscriptionsResponse } = await client.subscriptionsApi.cancelSubscription(id);
  const { subscription } = subscriptionsResponse;

  return subscription;
};

const getActiveSubscription = async (customerId) => {
  // create subscriptions search query
  const query = { filter: { customerIds: [customerId] } };

  // query subscriptions with given search criteria
  const { result: subscriptionsResponse } = await client.subscriptionsApi.searchSubscriptions({ query });
  const { subscriptions } = subscriptionsResponse;

  // get active subscription with a set cancellation date
  return subscriptions.find(({ status, canceledDate }) => status === "ACTIVE" && !canceledDate);
};

const api = {
  POST: async (req, res) => {
    try {
      const user = "NBE7TRXZPGZXNBD64JB6DR5AGR"; // req.headers["x-user"];
      const subscription = await getActiveSubscription(user);

      if (!subscription) {
        return res.status(StatusCodes.BAD_REQUEST).end(); // no active subscription found
      }

      const canceledSubscription = await cancelSubscription(subscription.id);

      return res.json(canceledSubscription);
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
