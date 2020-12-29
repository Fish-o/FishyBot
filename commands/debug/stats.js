exports.run = async (client, message, args) => {
    message.channel.send('did you mean !echostats?');
    let commandFile = require ("/../games/echostats.js");
    commandFile.run(client, message, args);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"stats",
    description: "blank",
    usage: "blank"
};
