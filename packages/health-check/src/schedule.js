const { CronJob } = require("cron");
const ms = require("ms");
const db = require("./db");
const { criticalChecks } = require("./checks/critical");
const { verboseChecks } = require("./checks/verbose");

// use this timezone to run all cron instances at the same time regardless of the server location
const timezone = "UTC";

// critical health checks job definition
const criticalJobSchedule = "*/5 * * * *"; // on every 5 minute mark
const criticalJobOnTick = async () => {
  const entry = {
    date: new Date().toISOString(),
    checks: await Promise.all(criticalChecks.map((check) => new Promise(check))),
  };

  // read before writing to make sure no external changes are overwritten
  db.read().get("critical").push(entry).write();
};
const criticalJob = new CronJob(criticalJobSchedule, criticalJobOnTick, null, false, timezone);

// verbose health checks job definition
const verboseJobSchedule = "0 * * * *"; // on every full hour mark
const verboseJobOnTick = async () => {
  const entry = {
    date: new Date().toISOString(),
    checks: await Promise.all(verboseChecks.map((check) => new Promise(check))),
  };

  // read before writing to make sure no external changes are overwritten
  db.read().get("verbose").push(entry).write();
};
const verboseJob = new CronJob(verboseJobSchedule, verboseJobOnTick, null, false, timezone);

// fire all health checks on startup (with delay for other services to boot)
setTimeout(() => {
  // fire first run manually
  criticalJob.fireOnTick();
  verboseJob.fireOnTick();

  // start cron schedule
  criticalJob.start();
  verboseJob.start();
}, ms("1 minute"));
