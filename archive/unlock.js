
const GraphemeSplitter = require('grapheme-splitter');
const ms = require('ms');
const Discord = require('discord.js');
//const { slice } = require('ffmpeg-static');

exports.run = (client, message, args) => {
    var splitter = new GraphemeSplitter();

    var channel = message.mentions.channels.first()
    if(!channel){channel= message.channel}
    // final permissions for a role
    //const rawrolePermissions = message.channel.permissionsFor(message.channel.guild.roles.everyone);
    //new Discord.Permissions(rawrolePermissions)

    console.log(channel.permissionsFor(message.channel.guild.roles.everyone));
    
    console.log(channel.permissionsFor(message.channel.guild.roles.everyone).has('SEND_MESSAGES'));
    
    
    channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null });
    channel.send('🔓The lockdown has been lifted🔓');
    var splittedtext = splitter.splitGraphemes(channel.name);
    console.log(splittedtext[splittedtext.length-1])
    /*if(splittedtext[-1] == '🔒'){
        message.channel.setName(splittedtext.slice(-1).join(''))
    } */
    

}


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['unlock'],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"unlock",
    description: "unlocks the channel where the command was run down",
    usage: "unlockdown"
};












