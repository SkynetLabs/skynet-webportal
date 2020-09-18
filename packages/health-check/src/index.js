process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env.PORTAL_URL) {
  throw new Error("You need to provide PORTAL_URL environment variable");
}

const express = require("express");
const bodyparser = require("body-parser");
const db = require("./db");

require("./schedule");

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3100;

const server = express();

server.use(bodyparser.urlencoded({ extended: false }));
server.use(bodyparser.json());
server.use((req, res, next) => {
  db.read();
  next();
});

server.get("/health-check", require("./api/index"));
server.get("/health-check/critical", require("./api/critical"));
server.get("/health-check/verbose", require("./api/verbose"));
server.get("/health-check/disabled", require("./api/disabled"));

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`Server listening at http://${host}:${port} (NODE_ENV: ${process.env.NODE_ENV})`);
});
