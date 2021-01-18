
var fs = require("fs");
const  Guild = require('../../database/schemas/Guild')


exports.run = async (client, message, args) =>{
    const uri = client.config.dbpath;
    // get the delete count, as an actual number.
    if(!args[0]){return message.channel.send("Enter a prefix")}
    
    await Guild.findOneAndUpdate({id: message.guild.id}, {prefix: args.join(' ')});

    message.channel.send('Changed **prefix** to `'+args.join(' ')+'`')

      
}
  
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['changeprefix','change_prefix'],
    perms: [
        'ADMINISTRATOR'
    ]
};
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"prefix",
    description: "Change the prefix",
    usage: "prefix [new prefix]"
};