exports.run = (client, message, args) => {
    message.send(client.dbgetuser(client, message.guild.id, message.author.id).xp)
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
