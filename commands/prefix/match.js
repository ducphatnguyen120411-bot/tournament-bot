const fs = require("fs");
const FILE = "data/matches.json";

module.exports = {
  name: "match",
  execute(message, args) {
    // Cú pháp:
    // !match TeamA TeamB BO3 8h Mirage
    // !match A B BO5 9h30 Inferno

    if (args.length < 5) {
      return message.reply(
        "❌ Cú pháp đúng:\n" +
        "`!match TeamA TeamB BO3/BO5 <giờ> <map>`\n" +
        "VD: `!match A B BO3 8h Mirage`"
      );
    }

    const teamA = args[0];
    const teamB = args[1];
    const type = args[2].toUpperCase(); // BO3 / BO5
    const time = args[3];              // 8h / 9h / 9h30
    const map = args.slice(4).join(" "); // map (có thể nhiều chữ)

    if (!["BO3", "BO5"].includes(type)) {
      return message.reply("❌ Chỉ hỗ trợ BO3 hoặc BO5");
    }

    const match = {
      teamA,
      teamB,
      type,
      time,
      map,
      winA: 0,
      winB: 0,
      createdAt: Date.now()
    };

    const data = fs.existsSync(FILE)
      ? JSON.parse(fs.readFileSync(FILE, "utf8"))
      : [];

    data.push(match);
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    message.channel.send(
      `⚔️ **TRẬN ĐẤU MỚI**\n\n` +
      `🟥 **${teamA}** vs 🟦 **${teamB}**\n` +
      `🧠 Thể thức: **${type}**\n` +
      `🗺️ Map: **${map}**\n` +
      `⏰ Giờ: **${time}**`
    );
  }
};;
