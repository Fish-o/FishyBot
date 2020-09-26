const Discord = require('discord.js');
exports.run = (client, message, args) => {
    message.channel.startTyping();
    client.dbgetuser(client, message.guild.id, message.author.id).then(user=>{


        const constant = 0.5; 

        let level = Math.floor(constant * Math.sqrt(user.xp))

        let xp_for_curlvl = Math.floor(Math.pow(level / constant,2));
        let xp_for_nextlvl = Math.floor(Math.pow(level+1 / constant,2));
        let diff = xp_for_nextlvl-xp_for_curlvl;

        const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${message.author.name}'s stats`)
        .addField('Level', level)
        .addField('Xp', user.xp)
        .addField('Xp for this lvl', xp_for_curlvl)
        .addField('Xp for next', xp_for_nextlvl)
        .addField('Xp till nex', diff)
        .setTimestamp();


        message.channel.send(embed);
        message.channel.stopTyping();
    })
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['xp','showrank','showxp'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"rank",
    description: "Shows the rank and xp of a given user",
    usage: "!rank (user)"
};
