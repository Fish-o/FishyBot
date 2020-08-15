exports.run = (client, message, args) => {
    message.channel.send("pong = " + `\`${client.ws.ping} ms\``).catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"ping",
    description: "Ping the bot",
    usage: "!ping"
};
