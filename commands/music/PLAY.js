const ytdl = require('ytdl-core');
const Discord = require('discord.js');

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
  
exports.run = async  (client, message, args, ops) => {
    voiceChannel = message.member.voice.channel;
    if(!voiceChannel)
        return message.channel.send("You are not in a voice channel");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if(!permissions.has('CONNECT'))
        return message.channel.send("You don't have the right permissions");
    if(!permissions.has('SPEAK'))
        return message.channel.send("You don't have the right permissions to speak");


    const url = message.content.split(' ');  
    const embed = new Discord.MessageEmbed();
    voiceChannel = message.member.voice.channel;

    let validate = await ytdl.validateURL(args[0]);

    if(validate){
        let playtube = client.commands.get('playtube');
        if (playtube){
            return playtube.run(client, message, args, ops);
        }
    } else if(validURL(args[0])){
        let playother = client.commands.get('playother');
        if (playother){
            return playother.run(client, message, args, ops);
        }
    } else {
        let ytsearch = client.commands.get('ytsearch');
        if (ytsearch){
            return ytsearch.run(client, message, args, ops);
        }
    }
        
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
    name:"play",
    description: "A universal play command",
    usage: "!play (yt url / audio url / yt search qeuery)"
};
