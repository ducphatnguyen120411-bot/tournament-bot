const fs = require("fs");

const BXH_CHANNEL = "1465634235254837405";
const DATA_FILE = "data/leaderboard.json";

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const [cmd, ...args] = message.content.split(" ");
    if (!["!win", "!lose"].includes(cmd)) return;

    const name = args.join(" ");
    if (!name) return message.reply("❌ Nhập tên VĐV");

    let data = fs.existsSync(DATA_FILE)
      ? JSON.parse(fs.readFileSync(DATA_FILE))
      : {};

    if (!data[name]) data[name] = { win: 0, lose: 0 };

    if (cmd === "!win") data[name].win++;
    if (cmd === "!lose") data[name].lose++;

    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    const sorted = Object.entries(data).sort(
      (a, b) => b[1].win - a[1].win
    );

    const bxh = sorted
      .map(
        ([n, s], i) =>
          `**${i + 1}. ${n}** — 🏆 ${s.win} | ❌ ${s.lose}`
      )
      .join("\n");

    const channel = client.channels.cache.get(BXH_CHANNEL);
    if (channel) {
      const msgs = await channel.messages.fetch({ limit: 1 });
      if (msgs.size > 0) await msgs.first().edit(bxh);
      else await channel.send(bxh);
    }

    message.reply(`✅ Đã cập nhật kết quả cho **${name}**`);
  });
};
