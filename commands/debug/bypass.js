exports.run = (client, message, args) => {
    if(message.author.id !== '325893549071663104') return message.channel.send("Oops looks like you dont have the right permissions :(");

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


