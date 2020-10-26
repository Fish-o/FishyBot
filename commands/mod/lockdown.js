
const GraphemeSplitter = require('grapheme-splitter');
//const ms = require('ms');
const Discord = require('discord.js');
//const { slice } = require('ffmpeg-static');

exports.run = (client, message, args) => {
    var splitter = new GraphemeSplitter();
    if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id !== client.config.master){
        return message.channel.send("You don't have the permissions to use this command!");
    }
    var channel = message.mentions.channels.first()
    if(!channel){channel= message.channel}
    // final permissions for a role
    //const rawrolePermissions = message.channel.permissionsFor(message.channel.guild.roles.everyone);
    //new Discord.Permissions(rawrolePermissions)

    console.log(channel.permissionsFor(channel.guild.roles.everyone));
    
    console.log(channel.permissionsFor(channel.guild.roles.everyone).has('SEND_MESSAGES'));
    
    if(channel.permissionsFor(channel.guild.roles.everyone).has('SEND_MESSAGES') != false){
        channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false });
        channel.setName(channel.name + '🔒');
        channel.send('🔒This channel has been locked down🔒');
        
    } else{
        channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: null });
        channel.send('🔓The lockdown has been lifted🔓');
        var splittedtext = splitter.splitGraphemes(channel.name);
        console.log(splittedtext[splittedtext.length-1])
        if(splittedtext[splittedtext.length-1] == '🔒'){
            channel.setName(channel.name.slice(0,-1))
        } 
    }

}


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['lock'],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"lockdown",
    description: "Locks the channel where the command was run down",
    usage: "lockdown"
};












