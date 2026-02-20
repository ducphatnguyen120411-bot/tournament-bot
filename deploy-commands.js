const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "feedback",
    description: "Đánh giá đơn hàng"
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("⏳ Đang đăng ký slash command...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("✅ Đã đăng ký xong");
  } catch (err) {
    console.error(err);
  }
})();
