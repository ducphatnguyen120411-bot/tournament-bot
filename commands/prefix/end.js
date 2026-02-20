const fs = require("fs");

const ANNOUNCE = "1465369594179883086";
const ROLE_ID = "ROLE_VO_DICH_ID";

module.exports = {
  name: "end",
  async execute(message) {
    const data = JSON.parse(fs.readFileSync("data/leaderboard.json"));
    const winner = Object.entries(data).sort((a,b)=>b[1]-a[1])[0];

    const channel = await message.guild.channels.fetch(ANNOUNCE);
    channel.send(`🏆 **VÔ ĐỊCH GIẢI:** **${winner[0]}**`);

    fs.writeFileSync("data/leaderboard.json", "{}");
  }
};
