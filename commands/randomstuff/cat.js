const Discord = require('discord.js');
const randomPuppy = require('random-puppy');

let command = async function(){
    return new Promise(async(resolve, reject)=>{
        let cat = await randomPuppy();
        if(cat.endsWith('.mp4')){
            return resolve(cat)
        } else{
            const embed = new Discord.MessageEmbed()
                .setColor("#15f153")
                .setDescription(`Oh look i found a cat :cat:`)
                .setImage(cat);
            return resolve(embed);    
        }
    })
}





exports.command = command;



exports.run = async (client, message, args) => {
    
    message.channel.send(await command())

    
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