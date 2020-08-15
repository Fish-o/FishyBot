const Discord = require('discord.js');
var moment = require('moment'); // require
var fs = require("fs");
exports.run = (client, message, args) =>{
    const cache_raw = fs.readFileSync(__dirname + '/../../jsonFiles/cache.json');
    const cache = JSON.parse(cache_raw);
    const cachedID = cache.data.find(guild => guild.id == message.guild.id).member_count_channel
    
    
    if(args[0] == 'on' || !args[0]){
        let mention_channel = message.mentions.channels.first()
        
        if(mention_channel){
            var query = {id: message.guild.id};
            const locate_string = "member_count_channel" 
            var values = { $set: {[locate_string]:mention_channel.id}}

            client.updatedb(client.config.dbpath, query, values, `Set the member counter to **${mention_channel.name}**`, message.channel)
            client.recache()

        } /*else if(message.guild.channels.find(channel => channel.id === cachedID)){

        }*/
        
        
        else if(!channel && !cachedID){
            return message.channel.send("Please mention a channel to set as the counter")
        }
        


        
        



    }
    else if(args[0] == 'off'){
        var query = {id: message.guild.id};
        const locate_string = "member_count_channel" 
        var values = { $set: {[locate_string]:null}}

        client.updatedb(client.config.dbpath, query, values, `Disabled the member counter`, message.channel)
        client.recache()
    }


}
exports.conf = {
    enabled: true,
    guildOnly: false,
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
    usage: "!membercount [#channel]"
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