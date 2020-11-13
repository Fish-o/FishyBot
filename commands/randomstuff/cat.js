const Discord = require('discord.js');
const randomPuppy = require('random-puppy');
exports.run = async (client, message, args) => {
    
    let cat = await randomPuppy('cats');
    if(cat.endsWith('.mp4')){
        message.channel.send(cat);
    } else{
        const embed = new Discord.MessageEmbed()
        .setColor("#15f153")
        .setDescription(`Oh look i found a cat :cat:`)
        .setImage(cat);

        console.log(cat)
        message.channel.send(embed);    
    }

    
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['cats','kitten','kitty'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"cat",
    description: "Shows a catto",
    usage: "cat"
};