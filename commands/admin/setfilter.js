exports.run = (client, message, args) => {
    let channelMention = message.mentions.channel.first();
    let regex = args.join();
    let channel = message.channel;
    if(channelMention && channelMention.type == 'text'){
        regex = regex.replace(channelMention.toString())
        channel = channelMention;
    }

    

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['setfiler', 'addfilter'],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"filter",
    description: "Add a text filter to a text channel",
    usage: "filter regex (channel)"
};
