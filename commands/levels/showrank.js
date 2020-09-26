exports.run = (client, message, args) => {
    message.channel.startTyping();
    client.dbgetuser(client, message.guild.id, message.author.id).then(user=>{


        message.channel.send(user.xp)
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
