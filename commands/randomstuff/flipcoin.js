var flipcoin = ["heads", "tails"];

exports.command = async function(member){
    return new Promise(async(resolve)=>{
        var randomIndex = Math.floor(Math.random() * flipcoin.length); 
    
        resolve(`<@${member.user.id}> `+ flipcoin[randomIndex]);
    })
}


exports.run = (client, message, args) =>{
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    var randomIndex = Math.floor(Math.random() * flipcoin.length); 

    message.channel.send(`<@${member.user.id}> `+ flipcoin[randomIndex]);
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"flipcoin",
    description: "Flip a coin",
    usage: "flipcoin"
};