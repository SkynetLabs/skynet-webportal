const http = require("http");
const { ipCheckService, ipRegex } = require("./utils");

const request = http.request({ host: ipCheckService }, (response) => {
  response.on("data", (data) => {
    if (ipRegex.test(data)) {
      process.stdout.write(data);
    } else {
      throw new Error(`${ipCheckService} responded with invalid ip: "${data}"`);
    }
  });
});

request.on("error", (error) => {
  throw error; // throw error to exit with code 1
});

request.end();
