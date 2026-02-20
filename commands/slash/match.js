const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("match")
    .setDescription("Tạo trận đấu")
    .addStringOption(o=>o.setName("team_a").setRequired(true))
    .addStringOption(o=>o.setName("team_b").setRequired(true))
    .addStringOption(o=>o.setName("time").setRequired(true))
    .addStringOption(o=>o.setName("bo").setRequired(true)),

  execute(interaction) {
    const match = {
      a: interaction.options.getString("team_a"),
      b: interaction.options.getString("team_b"),
      time: interaction.options.getString("time"),
      bo: interaction.options.getString("bo"),
      scoreA: 0,
      scoreB: 0
    };

    const matches = JSON.parse(fs.readFileSync("data/matches.json", "utf8"));
    matches.push(match);
    fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, 2));

    const embed = new EmbedBuilder()
      .setTitle("⚔️ TRẬN ĐẤU")
      .setDescription(`${match.a} vs ${match.b}`)
      .addFields(
        { name: "⏰ Giờ", value: match.time },
        { name: "🧠 Thể thức", value: match.bo }
      );

    interaction.reply({ embeds: [embed] });
  }
};
