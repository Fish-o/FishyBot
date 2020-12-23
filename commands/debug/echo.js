exports.run = async (client, message, args) => {
    message.channel.send('did you mean f!echovrml')
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
    name:"echo",
    description: "blank",
    usage: "blank"
};
