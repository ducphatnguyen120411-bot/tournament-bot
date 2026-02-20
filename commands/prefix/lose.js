const fs = require("fs");

const DATA_FILE = "./data.json";

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ players: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  name: "lose",
  run(client, message, args) {
    if (!args[0]) {
      return message.reply("❌ Dùng: `!lose <tên_vđv>`");
    }

    const player = args.join(" ");
    const data = loadData();

    if (!data.players[player]) {
      data.players[player] = { win: 0, lose: 0 };
    }

    data.players[player].lose += 1;
    saveData(data);

    message.channel.send(`💀 **${player}** +1 LOSE`);
  }
};
