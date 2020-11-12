const ms = require("ms");
exports.run = async (client, message, args) => {
    let action;
    let channel = message.mentions.channels.first() || message.channel;
    
    if(['off', 'disable'].includes(args[0].toLowerCase())){
        action = 'off'
    } else if(['on', 'enable'].includes(args[0].toLowerCase())){
        action = 'on'
    } else{
        action = 'on'
    }

    if ( action == 'on'){
        channel.setNSFW(true, `Member ${message.author.name} requested to change the nsfw mode`)
        message.channel.send('Set nsfw mode '+ action)
    } else if ( action == 'off'){
        channel.setNSFW(false, `Member ${message.author.name} requested to change the nsfw mode`)
        message.channel.send('Set nsfw mode '+ action)
    }else {
        message.channel.send('Something went wrong')
        console.log('Something went wrong with set nsfw');
        console.log('new nsfw: '+ action)
        console.log('channel/guild id: ' + channel.id + ', '+ message.guild.id)
    }
    
}


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['nsfwset'],
    perms: [
        'MANAGE_CHANNELS'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"setnsfw",
    description: "Sets this channel to nsfw",
    usage: "setnsfw <off/on> <channel>"
};
