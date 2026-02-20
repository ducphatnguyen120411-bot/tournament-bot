const fs = require("fs");
const BXH_CHANNEL = "1465634235254837405"; // kênh BXH

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const [cmd, name] = message.content.split(" ");
    if (!["!win", "!lose"].includes(cmd) || !name) return;

    let data = fs.existsSync("data/leaderboard.json")
      ? JSON.parse(fs.readFileSync("data/leaderboard.json"))
      : {};

    if (!data[name]) data[name] = { win: 0, lose: 0 };

    if (cmd === "!win") data[name].win++;
    if (cmd === "!lose") data[name].lose++;

    fs.writeFileSync("data/leaderboard.json", JSON.stringify(data, null, 2));

    // update BXH
    const channel = await client.channels.fetch(BXH_CHANNEL);
    await channel.bulkDelete(10).catch(() => {});

    let text = "🏆 **BẢNG XẾP HẠNG**\n\n";
    Object.entries(data)
      .sort((a, b) => b[1].win - a[1].win)
      .forEach((p, i) => {
        text += `${i + 1}. ${p[0]} — ${p[1].win}W | ${p[1].lose}L\n`;
      });

    channel.send(text);
  });
};
