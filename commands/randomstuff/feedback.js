fs = require('fs')
const Discord = require('discord.js');


exports.run = (client, message, args) => {
    const json_feedback_raw = fs.readFileSync(__dirname + '/../../jsonFiles/feedback.json');
    
    let feedback = JSON.parse(json_feedback_raw);
    const time = new Date().getTime();
    feedback.sort((a,b) => a.time > b.time)

    if(message.author.id == client.config.master && args[0].toLowerCase() == 'list'){
        feedback.forEach(element => {
            var date = new Date(element.time).toISOString().
                                            replace(/T/, ' ').      
                                            replace(/\..+/, '')

            message.channel.send(`**${element.user}** in **${element.guild}** on \`${date}\` > ${element.message}`)
            /*
            const embed = new Discord.MessageEmbed()
        
            embed.setColor("#ff00ff");
            embed.setTitle('Warnings for user: '+userTAG);
            embed.addFields();
            for (var i = 0; i < warnings.length; i++){
                var date_time = new Date(warnings[i]['time']).toDateString()
                
                embed.addField(date_time+' - by '+client.users.cache.get(warnings[i]['warner']).tag, 'Reason: ' + warnings[i]['warn']);
            }
            embed.setThumbnail(user.avatarURL());

            message.channel.send(embed);
            */
        });
    } else if(message.author.id == client.config.master && args[0].toLowerCase() == 'rm'){
        feedback.forEach(element => {
            let new_args = args
            new_args.shift()
            new_args = new_args.join(' ')
            if (element.user == new_args){
                message.channel.send(`Deleted a message from ${element.user}`)
                feedback.splice( feedback.indexOf(element), 1 );
            } else if (element.guild == new_args){
                message.channel.send(`Deleted a message from ${element.user}`)
                feedback.splice( feedback.indexOf(element), 1 );
            } else if (element.message == new_args){
                message.channel.send(`Deleted a message from ${element.user}`)
                feedback.splice( feedback.indexOf(element), 1 );
            }

            
            /*
            const embed = new Discord.MessageEmbed()
        
            embed.setColor("#ff00ff");
            embed.setTitle('Warnings for user: '+userTAG);
            embed.addFields();
            for (var i = 0; i < warnings.length; i++){
                var date_time = new Date(warnings[i]['time']).toDateString()
                
                embed.addField(date_time+' - by '+client.users.cache.get(warnings[i]['warner']).tag, 'Reason: ' + warnings[i]['warn']);
            }
            embed.setThumbnail(user.avatarURL());

            message.channel.send(embed);
            */
        });
        const raw_feedback = JSON.stringify(feedback)
        fs.writeFile(__dirname + '/../../jsonFiles/feedback.json', raw_feedback, function(err) {
            if (err) {
                console.log(err);
            }
            message.channel.send("Saved!").catch(console.error);
        });
    } else if(args[0]){
        feedback.push({time:time, user:message.member.user.tag, guild:message.guild.name, message:args.join(' ')})
        const raw_feedback = JSON.stringify(feedback)
        fs.writeFile(__dirname + '/../../jsonFiles/feedback.json', raw_feedback, function(err) {
            if (err) {
                console.log(err);
            }
            message.channel.send("Thank you for the feedback!").catch(console.error);
        });
        
    } else {
        message.channel.send("What is your feedback? type `cancel` to stop")
        message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(collected => {
            if(collected.first().content){
                if(collected.first().content.toLowerCase() != 'cancel' ){
                    feedback.push({time:time, user:message.member.user.tag, guild:message.guild.name, message:collected.first().content})
                    const raw_feedback = JSON.stringify(feedback)
                    fs.writeFile(__dirname + '/../../jsonFiles/feedback.json', raw_feedback, function(err) {
                        if (err) {
                            console.log(err);
                        }
                        message.channel.send("Thank you for the feedback!").catch(console.error);
                    });
                }
            }
        });
    }
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"feedback",
    description: "Allows you to give the developer feedback, only people with the 'MANAGE_MESSAGES' permision are allowed to send feedback to reduce spam.",
    usage: "!feedback [feedback]"
};
