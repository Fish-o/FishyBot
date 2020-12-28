const Discord = require('discord.js');
const randomPuppy = require('random-puppy');


let command = async function(){
    return new Promise(async(resolve, reject)=>{
        let url = await randomPuppy('dogpictures');
        
        const embed = new Discord.MessageEmbed()
            .setColor("#15f153")
            .setDescription(`Oh look i found a cuty dog :dog:`)
            .setImage(url);

        return resolve(embed);    
    
    })
}

exports.command = command;

exports.run = async (client, message, args) =>{
    message.channel.send(command())
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['dogs','pup','puppy'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"dog",
    description: "Shows a cute doggo",
    usage: "dog"
};