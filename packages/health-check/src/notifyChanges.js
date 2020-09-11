const db = require("./db");
const { sendMessageToHealthCheckChannel, getRoleByName } = require("./discord");

const { PORTAL_NAME = "PORTAL_NAME not defined" } = process.env;

const notificationTimestamps = { critical: 0, verbose: 0 };
const notificationUnchangedInterval = 24 * 60 * 60 * 1000; // 24 hours

function notifyChanges(type) {
  const [currentEntry, previousEntry] = db.get(type).orderBy("date", "desc").take(2).value();

  if (!currentEntry) return;

  const currentPassing = currentEntry.checks.filter(({ up }) => up).length;
  const currentTotal = currentEntry.checks.length;
  const sendMessage = () => {
    notificationTimestamps[type] = Date.now();

    const message = `${PORTAL_NAME}: ${currentPassing} / ${currentTotal} ${type} checks passing`;

    if (currentPassing === currentTotal) return sendMessageToHealthCheckChannel(message);

    const role = getRoleByName("skynet-prod");
    const allowedMentions = { roles: [role.id] };
    const failedChecks = currentEntry.checks.filter(({ up }) => !up);
    const embed = {
      title: `${type} check failures`,
      description: `\`\`\`${JSON.stringify(failedChecks, null, 2)}\`\`\``,
    };

    sendMessageToHealthCheckChannel({ content: `${message} /cc <@&${role.id}>`, allowedMentions, embed });
  };

  if (!previousEntry) {
    return sendMessage();
  }

  const previousPassing = previousEntry.checks.filter(({ up }) => up).length;
  const previousTotal = previousEntry.checks.length;
  const shouldSendNotificationUpdate = notificationTimestamps[type] + notificationUnchangedInterval < Date.now();

  if (shouldSendNotificationUpdate || previousPassing !== currentPassing || previousTotal !== currentTotal) {
    return sendMessage();
  }
}

module.exports = notifyChanges;
