const fs = require("fs");

const LEADERBOARD = "data/leaderboard.json";
const MATCHES = "data/matches.json";

module.exports = {
  name: "playoff",
  execute(message) {
    if (!fs.existsSync(LEADERBOARD))
      return message.reply("❌ Chưa có BXH");

    const lb = JSON.parse(fs.readFileSync(LEADERBOARD, "utf8"));
    const players = Object.entries(lb)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(p => p[0]);

    if (players.length < 4)
      return message.reply("❌ Cần ít nhất 4 VĐV để play-off");

    const matches = fs.existsSync(MATCHES)
      ? JSON.parse(fs.readFileSync(MATCHES, "utf8"))
      : [];

    const createIfNotExists = (a, b, stage) => {
      const exists = matches.find(
        m => m.stage === stage && m.teamA === a && m.teamB === b
      );
      if (!exists) {
        matches.push({
          id: Date.now() + Math.random(),
          teamA: a,
          teamB: b,
          type: stage === "Final" ? "BO5" : "BO3",
          time: "TBD",
          map: "TBD",
          winA: 0,
          winB: 0,
          stage
        });
      }
    };

    // Bán kết
    createIfNotExists(players[0], players[3], "Semi Final");
    createIfNotExists(players[1], players[2], "Semi Final");

    fs.writeFileSync(MATCHES, JSON.stringify(matches, null, 2));

    message.channel.send(
      "🔥 **PLAYOFF ĐÃ TẠO**\n\n" +
      `🥇 ${players[0]} vs ${players[3]} (Bán kết)\n` +
      `🥈 ${players[1]} vs ${players[2]} (Bán kết)\n\n` +
      "➡️ Thắng BK sẽ vào **Chung kết (BO5)**"
    );
  }
};
