exports.run = (client, message, args) => {
    message.channel.send("pong = " + `\`${client.ws.ping} ms\``).catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['lb'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"leaderboard",
    description: "Shows the xp leaderboard of the server",
    usage: "!leaderboard"
};
