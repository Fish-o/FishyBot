const Discord = require('discord.js');
exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    let voiceChannel = message.member.voice.channel;
    
    if(!fetched)
        return message.channel.send("There isn't any music playing in this guild!");
    
    if(!voiceChannel)
        return message.channel.send("You are not in a voice channel");        

    let userCount = voiceChannel.members.size;
    
    let required = Math.floor(userCount/2);

    if(!fetched.queue[0].voteSkips)
        fetched.queue[0].voteSkips = [];
    
    if(fetched.queue[0].voteSkips.includes(message.member.id))
        return message.channel.send(`Sorry you already voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required`)    

    fetched.queue[0].voteSkips.push(message.member.id);
    
    ops.active.set(message.guild.id, fetched);

    if(fetched.queue[0].voteSkips.length >= required){
        const Embed = new Discord.MessageEmbed()
        .setColor('#0000ff')
        .setTitle('Successfully skipped the track')
        //.setDescription(`${fetched.queue[0].songTitle}`)
        .setTimestamp()
        //.setAuthor(message.author.id, message.author.displayAvatarURL());

        message.channel.send(Embed);

        message.channel.send("Successfully skipped song!");
        return fetched.dispatcher.emit('end');
    }

    message.channel.send(`Successfully voted to skip! ${fetched.queue[0].voteSkips.length}/${required} required`);

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
    name:"skip",
    description: "Skips the current song",
    usage: "!skip"
};