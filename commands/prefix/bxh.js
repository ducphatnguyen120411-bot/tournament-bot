const fs = require("fs");
const CHANNEL = "1465634235254837405";

module.exports = {
  name: "bxh",
  execute(message) {
    if (message.channel.id !== CHANNEL) return;

    const data = JSON.parse(fs.readFileSync("data/leaderboard.json"));
    let text = "🏆 **BẢNG XẾP HẠNG VĐV**\n\n";

    Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .forEach((p, i) => {
        text += `${i + 1}. **${p[0]}** — ${p[1]} điểm\n`;
      });

    message.channel.send(text);
  }
};
