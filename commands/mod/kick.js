exports.run = (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    
    
    if(!member)
        //you have to type !kick then @username#1234 as an example
        return message.channel.send("Please mention a valid member of this server");
    if(!member.kickable) 
        return message.channel.send("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) {reason = "No reason provided";}
    
    member.kick(reason)
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'KICK_MEMBERS'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"kick",
    description: "Kick a user from the server.",
    usage: "f!kick [user] [reason]"
};