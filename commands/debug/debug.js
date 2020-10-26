exports.run = (client, message, args) => {
    //emoji = client.emojis.cache.get('729618946382364783')
    //message.channel.send()
    console.log(client.cachedMessageReactions)
    console.log(args.join())

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
    name:"debug",
    description: "a debug command",
    usage: "no usage"
};