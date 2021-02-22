import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const api = {
  GET: async (req, res) => {
    console.log(req.headers);

    try {
      const { result } = await client.customersApi.retrieveCustomer("R7R0NY1Z8WT11D43564EEFKTYR");

      res.json(result?.customer?.cards ?? []);
    } catch (error) {
      // console.log(error);
      res.json([]);
    }
  },
};

export default (req, res) => {
  if (req.method in api) {
    api[req.method](req, res);
  } else {
    res.status(StatusCodes.NOT_FOUND);
  }
};
