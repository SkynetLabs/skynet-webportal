const { getYesterdayISOString } = require("./utils");

require("yargs/yargs")(process.argv.slice(2)).command(
  "$0 <type>",
  "Skynet portal health checks",
  (yargs) => {
    yargs
      .positional("type", {
        describe: "Type of checks to run",
        type: "string",
        choices: ["critical", "extended"],
      })
      .option("portal-url", {
        describe: "Skynet portal url",
        default: process.env.PORTAL_URL || "https://siasky.net",
        type: "string",
      })
      .option("state-dir", {
        describe: "State directory",
        default: process.env.STATE_DIR || "state",
        type: "string",
      });
  },
  async ({ type, portalUrl, stateDir }) => {
    process.env.PORTAL_URL = portalUrl;
    process.env.STATE_DIR = stateDir;

    const db = require("../src/db");
    const checks = require(`../src/checks/${type}`);

    const entry = {
      date: new Date().toISOString(),
      checks: await Promise.all(checks.map((check) => new Promise(check))),
    };

    db.read() // read before writing to make sure no external changes are overwritten
      .get(type) // get the list of records of given type
      .push(entry) // insert new record
      .remove(({ date }) => date < getYesterdayISOString()) // drop old records
      .write();
  }
).argv;
