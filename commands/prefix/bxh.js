const fs = require("fs");
const BXH_CHANNEL = "1465634235254837405";

module.exports = {
  name: "bxh",
  execute(message) {
    if (message.channel.id !== BXH_CHANNEL) return;

    const data = JSON.parse(fs.readFileSync("data/leaderboard.json"));
    let text = "🏆 **BẢNG XẾP HẠNG**\n\n";

    Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .forEach((t, i) => {
        text += `${i + 1}. ${t[0]} — ${t[1]} điểm\n`;
      });

    message.channel.send(text);
  }
};
