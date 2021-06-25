const got = require("got");

const getCurrentAddress = async () => {
  try {
    const { body } = await got("http://whatismyip.akamai.com");
    if (body) return body;
    throw new Error("whatismyip.akamai.com responded with empty body");
  } catch (error) {
    console.log(error.message);
    return "-- error fetching ip address from whatismyip.akamai.com --";
  }
};

module.exports = async function middleware() {
  const ip = await getCurrentAddress();

  return (check) => {
    if (check.ip && check.ip !== ip) {
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
