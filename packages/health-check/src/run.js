const { getYesterdayISOString } = require("./utils");
const createMiddleware = require("./checks/middleware");

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
        default: process.env.SKYNET_PORTAL_API || "https://siasky.net",
        type: "string",
      })
      .option("state-dir", {
        describe: "State directory",
        default: process.env.STATE_DIR || "state",
        type: "string",
      });
  },
  async ({ type, portalUrl, stateDir }) => {
    process.env.SKYNET_PORTAL_API = portalUrl;
    process.env.STATE_DIR = stateDir;

    const db = require("../src/db");
    const checks = require(`../src/checks/${type}`);
    const middleware = await createMiddleware();

    const entry = {
      date: new Date().toISOString(),
      checks: (await Promise.all(checks.map((check) => new Promise(check)))).map(middleware),
    };

    db.read() // read before writing to make sure no external changes are overwritten
      .get(type) // get the list of records of given type
      .push(entry) // insert new record
      .remove(({ date }) => date < getYesterdayISOString()) // drop old records
      .write();

    // exit with code 1 if any of the checks report failure
    if (entry.checks.some(({ up }) => !up)) {
      console.log(entry.checks.filter(({ up }) => !up));
      process.exit(1);
    }
  }
).argv;
