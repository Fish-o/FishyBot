const Discord = require('discord.js');
exports.run = (client, message, args) =>{
    if(!message.member.voice.channel)
        return message.channel.send("You are not in a voice channel");
    else{
        message.channel.send("Bye bye!");
        return message.guild.me.voice.channel.leave();
    }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['leave'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"stop",
    description: "Leaves the voice channel",
    usage: "f!stop"
};