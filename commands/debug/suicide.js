exports.run = (client, message, args) => {
    if(message.author.id !== '325893549071663104'){return message.channel.send('1-800-273-8255')}
    message.channel.send('Goodbey cruel world')
    message.guild.leave();
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['self destruct'],
    perms: []
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"suicide",
    description: "NO DONT DO IT, YOU HAVE SO MUCH TO LIVE FOR",
    usage: "f!suicide"
};