const Discord = require('discord.js');
exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    if(!fetched)
        return message.channel.send("There isn't any music playing in this guild!");
        
    let queue = fetched.queue;
    let nowPlaying = queue[0];
    console.log(nowPlaying)
    let bar = '▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬';
    //20
    //🔘 ▬▬▬▬▬▬▬▬▬ ▬▬▬▬▬▬▬▬▬▬ ▬▬▬▬▬▬▬▬▬▬
    let size    = 'big';
    let results = nowPlaying.url.match('[\\?&]v=([^&#]*)');
    let video   = (results === null) ? url : results[1];

    const Embed = new Discord.MessageEmbed()
    .setTimestamp()
    .setTitle(nowPlaying.songTitle)
    .setURL(nowPlaying.url)
    .setDescription(`Requested by: \`${nowPlaying.requester}\`` )
    .setThumbnail('http://img.youtube.com/vi/' + video + '/0.jpg');

    //let resp = `__**Now playing**__\n**${nowPlaying.songTitle}** -- Requested by **${nowPlaying.requester}**`;
    message.channel.send(Embed);    
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['nowplaying','playing','np'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"nowplaying",
    description: "Shows what track is playing",
    usage: "f!nowplaying"
};