import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const api = {
  GET: async (req, res) => {
    try {
      const user = "NBE7TRXZPGZXNBD64JB6DR5AGR"; // req.headers["x-user"];

      // create subscriptions search query
      const query = { filter: { customerIds: [user] } };

      // query subscriptions with given search criteria
      const { result: subscriptionsResponse } = await client.subscriptionsApi.searchSubscriptions({ query });
      const { subscriptions } = subscriptionsResponse;

      // get active subscription
      const subscription = subscriptions.find(({ status }) => status === "ACTIVE");

      if (!subscription) {
        return res.status(StatusCodes.NO_CONTENT).end(); // no active subscription found
      }

      console.log("....", subscription);

      return res.json(subscription);
    } catch (error) {
      console.log(error);
      console.log(error?.errors);

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
