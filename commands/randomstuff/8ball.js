
const axios = require('axios');
const Discord = module.require('discord.js');
let command = async function(question, member){
    return new Promise(async(resolve)=>{

        const { data } = await axios.get("https://nekos.life/api/v2/8ball")
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(`${member.nickname || member.user.tag}: _${question}_`)
            .setImage(data.url)
        resolve(embed)
    })


}

exports.command = command;
exports.run = async (client, message, args) => {
    if(!args[0]){
        return message.channel.send('You need to ask a question to the magical 8 ball!')
    }
    message.channel.send(await command(args.join(' ')))
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
    name:"8ball",
    description: "Ask a question to the magical 8ball",
    usage: "8ball [question]"
};
