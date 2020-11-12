const ms = require("ms");
exports.run = async (client, message, args) => {

    let channel = message.mentions.channels.first() || message.channel;
    
    channel.lockPermissions(`Member ${message.author.name} requested to sync perms`);
    message.channel.send(`Sync the perms of the channel called \`${channel.name}\``)

    
}


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['syncchannelperms'],
    perms: [
        'MANAGE_CHANNELS'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"syncperms",
    description: "Sync a channels permissions with the parent category+",
    usage: "syncperms <channel>"
};
