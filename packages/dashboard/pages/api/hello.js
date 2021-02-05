// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import jwt from "express-jwt";
import jwks from "jwks-rsa";
import config from "../../src/config";

// This middleware assumes that the app is secured using ORY Oathkeeper, in which case we
// verify the JSON Web Token issued by ORY Oathkeeper using the jwt-express middleware.

const middleware = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  secret: jwks.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.jwksUrl,
  }),
  algorithms: ["RS256"],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async (req, res) => {
  await runMiddleware(req, res, middleware);

  console.log(Object.keys(req));
  console.log(req.user);
  res.statusCode = 200;
  res.json({ name: "John Doe" });
};
