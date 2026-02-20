const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers
  ]
});

const DATA_FILE = "./data.json";
const CHAMP_ROLE_ID = "ROLE_CHAMPION_ID"; // đổi
const TEAM_ROLE_ID = "ROLE_TEAM_ID"; // role được tham gia

function load() {
  if (!fs.existsSync(DATA_FILE))
    return { teams: {}, matches: [], players: {} };
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function save(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let data = load();

client.once("ready", () => {
  console.log("Bot giải đấu ONLINE");
});

// kiểm tra BO
function checkWinner(match) {
  const need = match.bo === "BO3" ? 2 : 3;
  if (match.scoreA >= need) match.winner = match.teamA;
  if (match.scoreB >= need) match.winner = match.teamB;
}

setInterval(async () => {
  const now = Date.now();
  for (const m of data.matches) {
    if (!m.reminded && m.time - now <= 5 * 60 * 1000) {
      const ch = await client.channels.fetch(m.channelId);
      ch.send(`⏰ **Sắp đấu:** ${m.teamA} vs ${m.teamB} (5 phút nữa)`);
      m.reminded = true;
      save(data);
    }
  }
}, 60000);

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // tạo trận
  if (msg.content.startsWith("!match")) {
    // !match A vs B BO3 20:30
    const [, a, , b, bo, time] = msg.content.split(" ");
    data.teams[a] ??= 0;
    data.teams[b] ??= 0;

    data.matches.push({
      teamA: a,
      teamB: b,
      bo,
      scoreA: 0,
      scoreB: 0,
      winner: null,
      time: Date.now() + 10 * 60000,
      channelId: msg.channel.id
    });
    save(data);
    return msg.reply(`✅ ${a} vs ${b} (${bo})`);
  }

  // map win
  if (msg.content.startsWith("!map")) {
    // !map 1 a
    const [, id, team] = msg.content.split(" ");
    const m = data.matches[id - 1];
    if (!m) return msg.reply("❌ Trận không tồn tại");

    team === "a" ? m.scoreA++ : m.scoreB++;
    checkWinner(m);

    if (m.winner) {
      data.teams[m.winner] += 3;
      const role = msg.guild.roles.cache.get(CHAMP_ROLE_ID);
      msg.channel.send(`🏆 **${m.winner} vô địch trận!**`);
    }
    save(data);
    return msg.reply("✅ Đã cập nhật map");
  }

  // BXH
  if (msg.content === "!rank") {
    const e = new EmbedBuilder().setTitle("📊 BẢNG XẾP HẠNG");
    Object.entries(data.teams)
      .sort((a, b) => b[1] - a[1])
      .forEach(([t, p], i) =>
        e.addFields({ name: `#${i + 1} ${t}`, value: `${p} điểm` })
      );
    msg.channel.send({ embeds: [e] });
  }
});

client.login(process.env.TOKEN);
