const schedule = require("node-schedule");
const db = require("./db");
const { sendMessageToHealthCheckChannel } = require("./discord");
const { criticalChecks } = require("./checks/critical");
const { verboseChecks } = require("./checks/verbose");

const { HOSTNAME } = process.env;

// execute the critical health-check script every 5 minutes
const criticalJob = schedule.scheduleJob("*/5 * * * *", async () => {
  const entry = {
    date: new Date().toISOString(),
    checks: await Promise.all(criticalChecks.map((check) => new Promise(check))),
  };

  db.get("critical").push(entry).write();

  const passing = entry.checks.filter(({ up }) => up).length;
  const total = entry.checks.length;

  sendMessageToHealthCheckChannel(`${HOSTNAME}: ${passing} / ${total} critical checks passing`);
});

// execute the verbose health-check script once per hour
const verboseJob = schedule.scheduleJob("0 * * * *", async () => {
  const entry = {
    date: new Date().toISOString(),
    checks: await Promise.all(verboseChecks.map((check) => new Promise(check))),
  };

  db.get("verbose").push(entry).write();

  const passing = entry.checks.filter(({ up }) => up).length;
  const total = entry.checks.length;

  sendMessageToHealthCheckChannel(`${HOSTNAME}: ${passing} / ${total} verbose checks passing`);
});

// Launch Health check jobs
setTimeout(() => {
  criticalJob.invoke();
  verboseJob.invoke();
}, 60 * 1000); // delay for 60s to give other services time to start up
