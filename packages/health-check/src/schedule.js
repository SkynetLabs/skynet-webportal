const schedule = require("node-schedule");
const db = require("./db");
const { basicChecks } = require("./basicChecks");
const { verboseChecks } = require("./verboseChecks");

// execute the basic health-check script every 5 minutes
const basicJob = schedule.scheduleJob("*/5 * * * *", async () => {
  const entry = { date: new Date().toISOString(), checks: [] };

  entry.checks = await Promise.all(basicChecks.map((check) => new Promise(check)));

  db.get("entries").push(entry).write();
});

// execute the verbose health-check script once per hour
const verboseJob = schedule.scheduleJob("0 * * * *", async () => {
  const entry = { date: new Date().toISOString(), checks: [] };

  entry.checks = await Promise.all(verboseChecks.map((check) => new Promise(check)));

  db.get("entries").push(entry).write();
});

// Launch Health check jobs
setTimeout(() => {
  basicJob.invoke();
  verboseJob.invoke();
}, 60 * 1000); // delay for 60s to give other services time to start up
