exports.run = async(client, message, args) => {
    message.channel.send('Did you mean !echo or !onward?')
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
    name:"vmrl",
    description: "blank",
    usage: "blank"
};