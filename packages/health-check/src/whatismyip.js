const http = require("http");

const request = http.request({ host: "whatismyip.akamai.com" }, (response) => {
  response.on("data", (data) => {
    process.stdout.write(data);
  });
});

request.on("error", (error) => {
  console.error(error);
});

request.end();
