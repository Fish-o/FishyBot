const ms = require("ms");
const Discord = require('discord.js');
const Reminder = require('../../database/schemas/Reminder');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.channel.send("You have to set a length of time to be reminded in!")
    //if (!message.content.includes("?")) return message.reply("Include a ? in your vote!")
    let member = message.member;
    
    
    let lenght = ms(args[0]+ " "+ args[1]);
    if(lenght){
        args.shift();
        args.shift();
    } else{
        lenght = ms(args[0]);
        if(lenght){
            args.shift();
        } else{
           return message.channel.send('You have to set a length of time to be reminded in!')
        }
    }
    
    

    if(lenght > 31*24*60*60*1000)
        return message.channel.send(`The time given (${ms(lenght)}) exceeded the limit of 31 days`);

    if(!args[0])
        return message.channel.send("You must have a message to be reminded with!");

    


    let new_reminder = new Reminder(
        {
            toMention:member.id,
            timeStamp:Date.now(),
            timelenght:lenght,
            message:args.join(' ')
        })
        
    await new_reminder.save().then((err)=>{
        console.log(err)
    })



    const Embed = new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setTitle('A Reminder has been set!')
        .addField('Wait time', ms(lenght))
        .addField('Message', args.join(' '))
        .addField('User', member)
    message.channel.send(Embed);
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['remind','remindme'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"reminder",
    description: "reminder",
    usage: "reminder (time to wait) (text)"
};
