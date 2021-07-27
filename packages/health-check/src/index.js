process.env.NODE_ENV = process.env.NODE_ENV || "development";

if (!process.env.SKYNET_PORTAL_API) {
  throw new Error("You need to provide SKYNET_PORTAL_API environment variable");
}

if (process.env.ACCOUNTS_ENABLED === "true" && !process.env.SKYNET_DASHBOARD_URL) {
  throw new Error("You need to provide SKYNET_DASHBOARD_URL environment variable when accounts are enabled");
}

const express = require("express");
const db = require("./db");

const host = process.env.HOSTNAME || "0.0.0.0";
const port = Number(process.env.PORT) || 3100;

const server = express();

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use((req, res, next) => {
  db.read();
  next();
});

server.get("/health-check", require("./api/index"));
server.get("/health-check/critical", require("./api/critical"));
server.get("/health-check/extended", require("./api/extended"));
server.get("/health-check/disabled", require("./api/disabled"));

server.listen(port, host, (error) => {
  if (error) throw error;

  console.info(`Server listening at http://${host}:${port} (NODE_ENV: ${process.env.NODE_ENV})`);
});
