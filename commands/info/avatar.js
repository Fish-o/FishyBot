exports.run = (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    message.channel.send(member.user.displayAvatarURL()).catch(console.error);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"avatar",
    description: "get the url of a persons avatar",
    usage: "avatar [user]"
};
