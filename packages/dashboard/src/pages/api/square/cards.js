import { Client, Environment } from "square";
import { StatusCodes } from "http-status-codes";

const client = new Client({
  environment: Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

const api = {
  GET: async (req, res) => {
    const user = "R7R0NY1Z8WT11D43564EEFKTYR"; // req.headers["x-user"];

    try {
      const { result: customerResult } = await client.customersApi.retrieveCustomer(user);
      const { customer } = customerResult;

      res.json(customer.cards);
    } catch (error) {
      res.json([]);
    }
  },
  // POST: async (req, res) => {
  //   const user = req.headers["x-user"];
  //   const card = {
  //     cardNonce: "YOUR_CARD_NONCE",
  //     cardholderName: "Amelia Earhart",
  //     billingAddress: {},
  //     verificationToken: "verification_token0",
  //   };

  //   card.bodyBillingAddress.addressLine1 = "500 Electric Ave";
  //   card.bodyBillingAddress.addressLine2 = "Suite 600";
  //   card.bodyBillingAddress.addressLine3 = "address_line_38";
  //   card.bodyBillingAddress.locality = "New York";
  //   card.bodyBillingAddress.sublocality = "sublocality2";
  //   card.bodyBillingAddress.administrativeDistrictLevel1 = "NY";
  //   card.bodyBillingAddress.postalCode = "10003";
  //   card.bodyBillingAddress.country = "US";

  //   try {
  //     const { result } = await client.customersApi.createCustomerCard(user, card);

  //     res.status(StatusCodes.NO_CONTENT);
  //   } catch (error) {
  //     console.log(Object.keys(error));

  //     res.status(StatusCodes.BAD_REQUEST);
  //   }
  // },
};

export default (req, res) => {
  if (req.method in api) {
    api[req.method](req, res);
  } else {
    res.status(StatusCodes.NOT_FOUND);
  }
};
