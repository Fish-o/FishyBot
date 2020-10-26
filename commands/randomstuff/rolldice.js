const Discord = require('discord.js');

exports.run = (client, message, args) =>{
    var dice = [1, 2, 3, 4, 5, 6];

    const embed = new Discord.MessageEmbed()
        .setColor("#15f153")
        .addField("First dice", dice[Math.floor(Math.random()*dice.length)], true)
        .addField("Second dice", dice[Math.floor(Math.random()*dice.length)], true)
        .setTimestamp();

    return message.channel.send(embed);    
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
    name:"rolldice",
    description: "Roll a dice",
    usage: "f!rolldice"
};
