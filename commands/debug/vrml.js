exports.run = async (client, message, args) => {
    message.channel.send('did you mean !echovrml, or !onward?')
    let commandFile = require ("/../games/echovrml.js");
    commandFile.run(client, message, args);
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
    name:"vrml",
    description: "blank",
    usage: "blank"
};
