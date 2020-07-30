process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env.PORTAL_URL) {
  throw new Error("You need to provide PORTAL_URL environment variable");
}

const express = require("express");
const bodyparser = require("body-parser");

require("./schedule");

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3100;

const server = express();

server.use(bodyparser.urlencoded({ extended: false }));
server.use(bodyparser.json());

server.get("/health-check", require("./endpointHealthCheck"));

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`Server listening at http://${host}:${port} (NODE_ENV: ${process.env.NODE_ENV})`);
});
