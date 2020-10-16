const  Guild = require('../database/schemas/Guild');
exports.run = async (client, message, args) => {
    if(!message.mentions.channels.first())
        return message.channel.send('You did not specify a valid channel');

        await Guild.update({id:guild.id}, {['levels.channel']: message.mentions.channels.first().id})
        message.mentions.channels.first().send('set this channel to recieve level up messages')
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['setlvlspam', 'levelspam', 'setlevelspam'],
    perms: [
        'MANAGE_GUILD'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"lvlspam",
    description: "Set the level spam to a specified channel",
    usage: "!lvlspam (channel mention)"
};
