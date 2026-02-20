const fs = require("fs");

module.exports = {
  name: "vote",
  async execute(message) {
    const voteData = {
      hours: ["8h", "9h", "9h30"],
      days: ["Thứ Bảy", "Chủ Nhật"]
    };

    const msg = await message.channel.send(
      "🗳️ **VOTE GIỜ & NGÀY THI ĐẤU**\n\n" +
      "**⏰ Giờ:**\n" +
      "🇦 8h\n🇧 9h\n🇨 9h30\n\n" +
      "**📅 Ngày:**\n" +
      "🇩 Thứ Bảy\n🇪 Chủ Nhật"
    );

    await msg.react("🇦");
    await msg.react("🇧");
    await msg.react("🇨");
    await msg.react("🇩");
    await msg.react("🇪");

    // lưu id message để đọc vote sau
    fs.writeFileSync(
      "data/voteMessage.json",
      JSON.stringify({ messageId: msg.id, channelId: msg.channel.id }, null, 2)
    );
  }
};
