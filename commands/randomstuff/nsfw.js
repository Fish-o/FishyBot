
const superagent = require('superagent');
const Discord = module.require('discord.js');
exports.run = async (client, message, args) => {
    if(message.channel.nsfw !== true){
        return message.channel.send('This isnt an nsfw channel')
    }

    let url = 'hentai';

    if(args[0]){
        url = args[0];
    }

    const { body } = await superagent.get('https://nekos.life/api/v2/img/'+url);

    if(body.msg == "404"){
        return message.channel.send('Nsfw type: `'+url+'` not found')
    } else if(!body.url){
        return message.channel.send('Something went wrong, please try again')
    }

    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
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
    name:"nsfw",
    description: "👀",
    usage: "nsfw [search option]"
};
