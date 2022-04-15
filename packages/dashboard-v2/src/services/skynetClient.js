import { SkynetClient } from "skynet-js";

// In production-like environment, let SkynetClient figure out the best portal
export default new SkynetClient(
  process.env.NODE_ENV === "development" ? `https://${process.env.GATSBY_PORTAL_DOMAIN}` : undefined
);
