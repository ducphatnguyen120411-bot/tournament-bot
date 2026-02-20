const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// load prefix commands
const prefixFiles = fs.readdirSync("./commands/prefix").filter(f => f.endsWith(".js"));
for (const file of prefixFiles) {
  const cmd = require(`./commands/prefix/${file}`);
  client.commands.set(cmd.name, cmd);
}

client.once("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

// CHỈ 1 messageCreate
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();

  const cmd = client.commands.get(cmdName);
  if (!cmd) return;

  try {
    await cmd.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ Lệnh bị lỗi");
  }
});

client.login(process.env.TOKEN);
