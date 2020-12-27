function match(msg, i) {
    if (!msg) return undefined;
    if (!i) return undefined;
    let user = i.members.cache.find(
        m =>
            m.user.username.toLowerCase().startsWith(msg) ||
            m.user.username.toLowerCase() === msg ||
            m.user.username.toLowerCase().includes(msg) ||
            m.displayName.toLowerCase().startsWith(msg) ||
            m.displayName.toLowerCase() === msg ||
            m.displayName.toLowerCase().includes(msg)
    );
    if (!user) return undefined;
    return user;
}
let Discord = require('discord.js')
exports.run = (client, message, args) => {
    let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild);

    
    
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


exports.interaction = async (client, interaction, args) => {
    console.log(args)
    let member = args.find(arg => arg.name == 'member').value;
    
    
    if(!member)
        //you have to type !kick then @username#1234 as an example
        return interaction.send(await interaction.error("Please mention a valid member of this server"));

    member = interaction.guild.members.cache.get(member);
    if(!member.kickable) 
        return interaction.send(await interaction.error("I cannot kick this user!","Do they have a higher role? Do I have kick permissions?"));

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.find(arg => arg.name == 'reason');
    if(!reason) reason = "No reason provided";
    else reason = reason.value;

    try{
        member.kick(reason)
        interaction.send(await interaction.succes(`${member.user.tag} has been kicked`, `By: ${interaction.member}\nReason: ${reason}`));
    }catch(error){
        interaction.send(await interaction.error(`Kicking failed`, 'Reason: '+error));
    }
        

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    interaction:{
        options:[
            {
                name:'Member',
                description:'Description',
                type:6,
                required:true
            },
            {
                name:'Reason',
                description:'The reason for the kick',
                type:3,
                required:false
            }
        ]

    },
    aliases: ['yeet'],
    perms: [
        'KICK_MEMBERS'
    ]
  };
  

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"kick",
    description: "Kick a user from the server.",
    usage: "kick [user] [reason]"
};