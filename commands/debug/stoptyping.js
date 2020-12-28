exports.run = (client, message, args) => {
    message.channel.stopTyping()

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
    name:"stoptyping",
    description: "a debug command",
    usage: "no usage"
};