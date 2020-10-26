const Discord = require('discord.js');
exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    if(!fetched)
        return message.channel.send("There isn't any music playing in this guild!");
    let queue = fetched.queue;


    const Embed = new Discord.MessageEmbed()
    .setColor('#0000ff')
    .setTitle('Queue')
    .setTimestamp()
    .setAuthor(message.author.id, message.author.displayAvatarURL());
    

    //let resp = '__**Queue**__\n';

    if(queue.length > 1){
        for(var i=1; i<queue.length; i++){
            Embed.addField(`[**${i}**] ${queue[i].songTitle}`, `Requested by **${queue[i].requester}**`, false)
        }

        return message.channel.send(Embed);  
    
    }
    else {
        return message.channel.send(`There are no songs in the queue!`);    
    }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['q'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"queue",
    description: "Shows the queue",
    usage: "f!queue"
};