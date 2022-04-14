import { SkynetClient } from "skynet-js";

const { NODE_ENV, GATSBY_PORTAL_DOMAIN } = process.env;

// In production-like environment, let SkynetClient figure out the best portal
export default new SkynetClient(NODE_ENV === "development" ? `https://${GATSBY_PORTAL_DOMAIN}` : undefined);
