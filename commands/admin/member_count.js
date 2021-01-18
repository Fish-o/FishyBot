const Discord = require('discord.js');
var moment = require('moment'); // require
var fs = require("fs");
exports.run = (client, message, args, db_cache) =>{
    const cachedID = db_cache.member_count_channel
    
    
    if(args[0] == 'on' || !args[0]){
        let mention_channel = message.mentions.channels.first()
        
        if(mention_channel){
            var query = {id: message.guild.id};
            const locate_string = "member_count_channel" 
            var values = {[locate_string]:mention_channel.id}

            client.updatedb( query, values, `Set the member counter to **${mention_channel.name}**`, message.channel)

        } /*else if(message.guild.channels.find(channel => channel.id === cachedID)){

        }*/
        
        
        else if(!channel && !cachedID){
            return message.channel.send("Please mention a channel to set as the counter")
        }
        


        
        



    }
    else if(args[0] == 'off'){
        var query = {id: message.guild.id};
        const locate_string = "member_count_channel" 
        var values = {[locate_string]:undefined}

        client.updatedb( query, values, `Disabled the member counter`, message.channel)
    } else{
        message.channel.send('Use the option `on` or `of`')
    }


}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['member_count','member-count','countmember'],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"membercount",
    description: "Shows how many members your server has!",
    usage: "membercount [on/off] [#channel]"
};

/*
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:

const path = require("path")
exports.help = {
    category: path.dirname(__dirname).split(path.sep).pop()
    name: */