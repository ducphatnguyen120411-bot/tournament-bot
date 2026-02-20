const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

/* ===== LOAD PREFIX COMMANDS ===== */
const prefixCommands = [];
const prefixPath = "./commands/prefix";

fs.readdirSync(prefixPath).forEach(file => {
  if (!file.endsWith(".js")) return;
  const command = require(`${prefixPath}/${file}`);
  prefixCommands.push(command);
});

/* ===== BOT READY ===== */
client.once("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

/* ===== MESSAGE HANDLER ===== */
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  for (const cmd of prefixCommands) {
    try {
      await cmd(client, message);
    } catch (err) {
      console.error("❌ Command error:", err);
    }
  }
});

client.login(process.env.TOKEN);
