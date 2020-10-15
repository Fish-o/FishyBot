exports.run = (client, message, args) => {
    return new Promise((resolve, reject) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel || voiceChannel.type !== 'voice') return message.reply('I couldn\'t connect to your voice channel...');
        voiceChannel.join().then(connection => {
            resolve(connection);
        }).catch(err => reject(err));



    });
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['joinchannel'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"join",
    description: "Joins a voice channel",
    usage: "!join"
};