import ky from "ky";

const prefix = process.env.NEXT_PUBLIC_PORTAL_DOMAIN ? `https://account.${process.env.NEXT_PUBLIC_PORTAL_DOMAIN}` : "";

export default ky.create({ prefixUrl: `${prefix}/api` });
