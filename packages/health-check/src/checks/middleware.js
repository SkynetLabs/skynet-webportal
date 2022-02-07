const got = require("got");
const { ipCheckService, ipRegex } = require("../utils");

const getCurrentAddress = async () => {
  // use serverip env variable when available (set via Dockerfile)
  if (process.env.serverip) return process.env.serverip;

  try {
    const { body } = await got(`http://${ipCheckService}`);
    if (ipRegex.test(body)) return body;

    throw new Error(`${ipCheckService} responded with invalid ip: "${body}"`);
  } catch (error) {
    console.log(error.message); // log error to console for future reference

    return null;
  }
};

module.exports = async function middleware() {
  const ip = await getCurrentAddress();

  return (check) => {
    // check only if current ip and check ip are provided
    if (ip && check.ip && check.ip !== ip) {
      check.up = false;
      check.errors = check.errors ?? [];
      check.errors.push({
        message: "Response ip was different than current server ip - possibly there was an error with routing request",
        data: { response: check.ip, server: ip },
      });
    }

    return check;
  };
};
