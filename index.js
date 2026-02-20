require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// prefix commands
client.prefixCommands = new Collection();

const prefixPath = path.join(__dirname, "commands", "prefix");

if (fs.existsSync(prefixPath)) {
  fs.readdirSync(prefixPath).forEach(file => {
    if (!file.endsWith(".js")) return;

    try {
      const command = require(path.join(prefixPath, file));
      if (typeof command === "function") {
        command(client);
        console.log(`✅ Loaded prefix command: ${file}`);
      } else {
        console.warn(`⚠️ ${file} không export function`);
      }
    } catch (err) {
      console.error(`❌ Lỗi khi load ${file}`);
      console.error(err);
    }
  });
} else {
  console.warn("⚠️ Không tìm thấy thư mục commands/prefix");
}

client.once("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.login(process.env.TOKEN);
