const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "match",
  execute(msg, args) {
    // !match A-B <20:30> <Mirage>
    if (args.length < 3)
      return msg.reply("❌ Dùng: !match A-B <giờ> <map>");

    // A-B
    const teams = args[0].split("-");
    if (teams.length !== 2)
      return msg.reply("❌ Team phải ghi dạng A-B");

    const teamA = teams[0];
    const teamB = teams[1];

    // <20:30> <Mirage>
    const time = args[1].replace(/[<>]/g, "");
    const map = args.slice(2).join(" ").replace(/[<>]/g, "");

    const embed = new EmbedBuilder()
      .setTitle("⚔️ TRẬN ĐẤU SẮP DIỄN RA")
      .setColor("Red")
      .addFields(
        { name: "👥 Đội đấu", value: `${teamA} 🆚 ${teamB}` },
        { name: "🕒 Giờ", value: time, inline: true },
        { name: "🗺️ Map", value: map, inline: true }
      )
      .setFooter({ text: "Tournament Bot" })
      .setTimestamp();

    msg.channel.send({ embeds: [embed] });
  }
};
