import { SkynetClient } from "skynet-js";

export default new SkynetClient(`https://${process.env.GATSBY_PORTAL_DOMAIN}`);
