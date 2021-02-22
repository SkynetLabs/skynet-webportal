import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const api = {
  GET: async (req, res) => {
    const user = "NBE7TRXZPGZXNBD64JB6DR5AGR"; // req.headers["x-user"];

    try {
      // get locations for invoices search query
      const { result: locationsResponse } = await client.locationsApi.listLocations();
      const { locations } = locationsResponse;

      // create invoices serach query
      const locationIds = locations.map(({ id }) => id);
      const customerIds = [user];
      const filter = { locationIds, customerIds };
      const sort = { field: "INVOICE_SORT_DATE", order: "DESC" };
      const query = { filter, sort };

      // query invoices with given search criteria
      const { result: invoicesResponse } = await client.invoicesApi.searchInvoices({ query, limit: 10 });
      const { invoices } = invoicesResponse;

      res.json(invoices);
    } catch (error) {
      console.log(error);
      console.log(error?.errors?.body);

      res.json([]); // todo: error handling
    }
  },
};

export default (req, res) => {
  if (req.method in api) {
    return api[req.method](req, res);
  }

  return res.status(StatusCodes.NOT_FOUND);
};
