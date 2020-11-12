
const superagent = require('superagent');
const Discord = module.require('discord.js');
exports.run = async (client, message, args) => {
    if(!args[0]){
        return message.channel.send('You need to ask a question to the magical 8 ball!')
    }
    const { body } = await superagent
    .get("https://nekos.life/api/v2/8ball")
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(`${message.member.nickname || message.author.tag}: _${args.join(" ")}_`)
    .setImage(body.url)
    message.channel.send({embed})
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
    name:"8ball",
    description: "Ask a question to the magical 8ball",
    usage: "8ball [question]"
};
