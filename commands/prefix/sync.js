const fs = require("fs");
const ROLE_ID = "1471860721108123893";
const FILE = "data/leaderboard.json";

module.exports = {
  name: "sync",
  async execute(message) {
    const role = message.guild.roles.cache.get(ROLE_ID);
    if (!role) return message.reply("❌ Không tìm thấy role");

    const data = fs.existsSync(FILE)
      ? JSON.parse(fs.readFileSync(FILE))
      : {};

    role.members.forEach(m => {
      if (!data[m.user.username]) {
        data[m.user.username] = 0;
      }
    });

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    message.channel.send(
      `✅ Đã sync **${role.members.size} VĐV** vào BXH`
    );
  }
};
