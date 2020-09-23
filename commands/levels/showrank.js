exports.run = (client, message, args) => {
    message.channel.send("pong = " + `\`${client.ws.ping} ms\``).catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['xp'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"rank",
    description: "Shows the rank and xp of a given user",
    usage: "!rank (user)"
};
