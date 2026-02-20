const fs = require("fs");
const ROLE_ID = "1471860721108123893";
const FILE = "data/leaderboard.json";

module.exports = {
  name: "win",
  async execute(message, args) {
    const mention = message.mentions.users.first();
    if (!mention) return message.reply("❌ Mention VĐV");

    const member = await message.guild.members.fetch(mention.id);
    if (!member.roles.cache.has(ROLE_ID))
      return message.reply("❌ Người này không phải VĐV");

    const point = Number(args[1] || 1);

    const data = JSON.parse(fs.readFileSync(FILE));
    const name = member.user.username;

    data[name] = (data[name] || 0) + point;

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    message.channel.send(`🏆 **${name}** +${point} điểm`);
  }
};
