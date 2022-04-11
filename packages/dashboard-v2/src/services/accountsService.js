import ky from "ky";

export default ky.create({ prefixUrl: "/api" });
