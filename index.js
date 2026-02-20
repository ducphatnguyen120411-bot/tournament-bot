const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const PREFIX = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// PREFIX COMMANDS
client.prefixCommands = new Collection();
for (const file of fs.readdirSync("./commands/prefix")) {
  const cmd = require(`./commands/prefix/${file}`);
  client.prefixCommands.set(cmd.name, cmd);
}

// SLASH COMMANDS
client.slashCommands = new Collection();
for (const file of fs.readdirSync("./commands/slash")) {
  const cmd = require(`./commands/slash/${file}`);
  client.slashCommands.set(cmd.data.name, cmd);
}

client.once("ready", () => {
  console.log("Bot online");
});

// PREFIX
client.on("messageCreate", async msg => {
  if (msg.author.bot || !msg.content.startsWith(PREFIX)) return;

  const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const cmd = client.prefixCommands.get(cmdName);
  if (cmd) cmd.execute(msg, args);
});

// SLASH
client.on("interactionCreate", async i => {
  if (!i.isChatInputCommand()) return;
  const cmd = client.slashCommands.get(i.commandName);
  if (cmd) await cmd.execute(i);
});

client.login(process.env.TOKEN);
