const Discord = require("discord.js");

const client = new Discord.Client();

const { DISCORD_BOT_TOKEN } = process.env;

const CHANNEL_IDS = {
  "skynet-portal-health-check": "684543533155352599",
};

client.on("ready", () => {
  sendMessageToHealthCheckChannel("hello there");
});

(async () => {
  try {
    await client.login(DISCORD_BOT_TOKEN);
  } catch (error) {
    console.log(`Could not connect to discord server: ${error.message}`);
  }
})();

function sendMessage(message, channelName) {
  const channel = client.channels.cache.get(CHANNEL_IDS[channelName]);

  if (!channel) {
    console.log(`Channel ${channelName} (id: ${CHANNEL_IDS[channelName]}) not found!`);

    return;
  }

  channel.send({ content: message });
}

function sendMessageToHealthCheckChannel(message) {
  return sendMessage(message, "skynet-portal-health-check");
}

module.exports = { sendMessage, sendMessageToHealthCheckChannel, CHANNEL_IDS };
