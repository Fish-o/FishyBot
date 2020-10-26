exports.run = (client, message, args) => {
    if(message.author.id !== client.config.master) return message.channel.send("Oops looks like you dont have the right permissions :(");

    if(!client.bypass){client.bypass = true;}
    else {client.bypass = false;}
}



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: []
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"fishmode",
    description: "a debug command",
    usage: "no usage"
};


