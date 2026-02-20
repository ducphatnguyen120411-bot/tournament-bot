require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// load prefix commands
client.prefixCommands = [];
const prefixPath = "./commands/prefix";
fs.readdirSync(prefixPath).forEach(file => {
  if (file.endsWith(".js")) {
    require(`${prefixPath}/${file}`)(client);
  }
});

client.once("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.login(process.env.TOKEN);
