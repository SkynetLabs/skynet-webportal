import ky from "ky";

const prefix = process.env.NEXT_PUBLIC_SKYNET_DASHBOARD_URL ?? "";

export default ky.create({ prefixUrl: `${prefix}/api` });
