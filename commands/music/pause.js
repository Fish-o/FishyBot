const Discord = require('discord.js');

exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    
    if(!fetched)
        return message.channel.send("There isn't any music playing in this guild!");
            
    if(!message.member.voice.channel)
        return message.channel.send("You are not in a voice channel");        

    if(fetched.dispatcher.paused)
        return message.channel.send("The music is already paused");
        
    fetched.dispatcher.pause();    
    const Embed = new Discord.MessageEmbed()
    .setColor('#00ff00')
    .setTitle('Successfully paused the track')
    .setDescription(`${fetched.queue[0].songTitle}`)
    .setTimestamp()
    .setAuthor(message.author.id, message.author.displayAvatarURL());
    message.channel.send(Embed);
    //message.channel.send(`Successfully paused the track **${fetched.queue[0].songTitle}**`);    
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
    name:"pause",
    description: "Pauses the music",
    usage: "!pause"
};