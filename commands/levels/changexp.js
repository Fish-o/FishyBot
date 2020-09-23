exports.run = (client, message, args) => {
    message.channel.send("pong = " + `\`${client.ws.ping} ms\``).catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['changemessages'],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"changexp",
    description: "Lets an admin add xp to a user",
    usage: "!changexp"
};
