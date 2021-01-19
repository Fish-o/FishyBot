const Discord = require('discord.js');
exports.run = (client, message, args) => {
    let serverembed = new Discord.MessageEmbed()
        .setColor("#9400D3")
        .setAuthor(client.user.tag, client.user.displayAvatarURL())
        .addField(`Version`,client.config.version, true)
        .addField(`Creator`,`Fish`, true)
        .addField(`Invite`, `[Check the FishyBot website!](https://fishman.live/)`, true);
   
    return message.channel.send(serverembed);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['invitelink', 'getinvite'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"invite",
    description: "Get the bot invite link",
    usage: "invite "
};
