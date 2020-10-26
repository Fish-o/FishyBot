const Discord = require('discord.js');



const  User = require('../../database/schemas/User')
const  Guild = require('../../database/schemas/Guild')

exports.run = async (client, message, args) => {
    function getUserFromMention(mention) {
        if (!mention) return;
    
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
    
            return client.users.cache.get(mention);
        }
    }
    const time_utc = new Date().getTime();



    var bad_person;
    if(!getUserFromMention(args[0])){return message.channel.send('Please mention a user')}
    else{
        args.shift()
        var bad_person = getUserFromMention(args[0]);
    }
    if(!args[0]) {args[0] = 'list'}//return message.channel.send("Please state a reason or action")
    var action = args[0].toLowerCase();
    if (!['add','list','removeall'].includes(args[0])){action = 'add';}
    else{
        args.shift();
    }
    const reason = args.join(' ');
    console.log(action)
    
    let guild = message.guild;
    
    


    


    const guildID = message.guild.id;
    const member = message.mentions.users.first() || message.guild.members.cache.get(args[0]).user
    const memberID = member.id.toString();



    
    
    
    if(action == 'list'){
       
	
        
        const dbGuild = await Guild.findOne({id: guildID});
        const guild_warning = dbGuild.warns;
        if(guild_warning.get(memberID)){
            if(guild_warning.get(memberID)[0]){

                const userID = memberID
                const user = client.users.cache.get(userID);
                const userTAG = user.tag;
                
                const warnings = guild_warning.get(memberID);
                
                
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
    
            } else {message.channel.send('Could not find any warnings!')}
    
        } else {
            message.channel.send('No warnings were found')
            
        }
        //if(!user_data){return message.channel.send('Could not find that user, did you run !dbadd?')}
       

            



    }
    if(action == 'add'){
        if(args[0]){
            // Constructing the warning
            var new_warning = {};
            //const bad_person_uuid =  user['uuid']
            new_warning['time'] = time_utc;
            new_warning['warner'] = message.author.id;
            new_warning['warn'] = reason;
            


            await Guild.updateOne({id: message.guild}, {$push :{[`warns.${memberID}`]: [new_warning]}});

            // Making embed
            var bad_pfp = member.avatarURL()
            const embed = new Discord.MessageEmbed()
            embed.setColor("#ff0000");
            embed.setTitle('User: '+member.tag+' has been warned');
            embed.addField('Reason: ', reason);
            embed.setThumbnail(bad_pfp);

            // Post embed
            message.channel.send(embed);
        }
    }
    if(action == 'removeall'){
        await Guild.updateOne({id: guild},  {[`warns.${memberID}`]: []});
        var bad_pfp = member.avatarURL()
        const embed = new Discord.MessageEmbed()
        embed.setColor("#00ff00");
        embed.setTitle('Warnings for user: '+member.tag+' have been deleted');
        embed.setThumbnail(bad_pfp);
        message.channel.send(embed);
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
    name:"warn",
    description: "Warns the user in chat and safes the warning, command includes: 'add', 'list' and 'removeall'",
    usage: "warn user [action (if none then add)] [reason]"
  };