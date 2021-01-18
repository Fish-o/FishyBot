const Discord = require('discord.js');
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

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

const  User = require('../../database/schemas/User')
const  Guild = require('../../database/schemas/Guild')
let command = async function(client, guild, author, action, member_id, reason){
    return new Promise(async (resolve, reject) => {
        const time_utc = new Date().getTime();
        const memberID = member_id;
        let dbGuild = await client.getDbGuild(guild.id);
        
        if(action == 'list'){
        
        
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
                        try{
                            embed.addField(date_time+' - by '+client.users.cache.get(warnings[i]['warner']).tag, 'Reason: ' + warnings[i]['warn']);
                        }catch(err){
                            Sentry.captureException(err);
                            embed.addField('failed warning')
                        }
                    }
                    embed.setThumbnail(user.avatarURL());
        
                    resolve(embed);
                    return
        
                } else {
                    const userID = memberID
                    const user = client.users.cache.get(userID);
                    const userTAG = user.tag;
                    const embed = new Discord.MessageEmbed();
                    embed.setColor("#ff00ff");
                    embed.setTitle('Warnings for user: '+userTAG);
                    embed.setDescription('No warnings')
                    embed.setThumbnail(user.avatarURL());
                    resolve(embed);
                    return;
                }
        
            } else {
                const userID = memberID
                const user = client.users.cache.get(userID);
                const userTAG = user.tag;
                const embed = new Discord.MessageEmbed();
                embed.setColor("#ff00ff");
                embed.setTitle('Warnings for user: '+userTAG);
                embed.setDescription('No warnings')
                embed.setThumbnail(user.avatarURL());
                resolve(embed);
                return;
                
            }
            //if(!user_data){return message.channel.send('Could not find that user, did you run !dbadd?')}
        }
        let member = guild.members.cache.get(memberID);
        if(action == 'add'){
            // Constructing the warning
            var new_warning = {};
            //const bad_person_uuid =  user['uuid']
            new_warning['time'] = time_utc;
            new_warning['warner'] = author.id;
            new_warning['warn'] = reason;
            


            await Guild.updateOne({id: guild.id}, {$push :{[`warns.${memberID}`]: new_warning}});

            // Making embed
            var bad_pfp = member.user.avatarURL()
            const embed = new Discord.MessageEmbed()
            embed.setColor("#ff0000");
            embed.setTitle('User: '+member.user.tag+' has been warned');
            embed.addField('Reason: ', reason);
            embed.setThumbnail(bad_pfp);

            // Post embed
            resolve(embed);
            return
            
        }
        if(action == 'removeall'){
            await Guild.updateOne({id: guild},  {[`warns.${memberID}`]: []});
            var bad_pfp = member.user.avatarURL()
            const embed = new Discord.MessageEmbed()
            embed.setColor("#00ff00");
            embed.setTitle('Warnings for user: '+member.user.tag+' have been deleted');
            embed.setThumbnail(bad_pfp);
            resolve(embed);
            return
        }
    });
}

exports.run = async (client, message, args, dbGuild) => {
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
    

    const member =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]) ||
    match(args.join(" ").toLowerCase(), message.guild);

    /*var bad_person;
    if(!getUserFromMention(args[0])){return message.channel.send('Please mention a user')}
    else{
        args.shift()
        var bad_person = getUserFromMention(args[0]);
    }*/
    if(!member){return message.channel.send('Please mention a user')}

    if(!args[0]) {args[0] = 'list'}//return message.channel.send("Please state a reason or action")
    var action = args[0].toLowerCase();
    if (!['add','list','removeall'].includes(action)){
        if(args[1]){
            action = args[1].toLowerCase();
            
            if (!['add','list','removeall'].includes(action)){
                action = 'add'
            } else{
                delete args[1]
            }
        }else{
            action = 'add';
        }
    }
    else{
        args.shift();
    }
    const reason = args.join(' ');
    
    let guild = message.guild;
    
    let embed = await command(client, guild, message.member, action, member.id, reason)|| message.error('Something has gone wrong');
    message.channel.send(embed); 
    
    
}

exports.interaction = async function(client, interaction, args){
    let action = args[0].name;
    let member_id = args[0].options.find(option => option.name === "member");
    let reason = args[0].options.find(option => option.name === "reason");
    if(!action){
        return interaction.send(interaction.error('Please choose an action to perform'))
    } else if(!member_id){
        return interaction.send(interaction.error('Please mention a member to warn'))
    }
    if(reason){
        reason = reason.value
    }
    let embed = await command(client, interaction.guild, interaction.member, action, member_id.value, reason) || interaction.error('Something has gone wrong');
    interaction.send(embed);    


}



exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        description:"Warn a member",
        options:[
            {
                name: "add",
                description: "Add a warning to a user",
                default:true,
                type: 1, // 1 is type SUB_COMMAND
                options:[
                    {
                        name:"member",
                        description:"Member to warn",
                        type:6,
                        required:true
                    },
                    {   
                        name: "Reason",
                        description: "The reason of the warning",
                        type: 3,
                        required: false
                    }
                ]
            },
            {
                name: "list",
                description: "List all warning of a user",
                type: 1,
                options:[
                    {
                        name:"member",
                        description:"Member to warn",
                        type:6,
                        required:true
                    }
                ]
            },
            {
                name: "removeall",
                description: "Remove all warnings from a user",
                type: 1,
                options:[
                    {
                        name:"member",
                        description:"Member to warn",
                        type:6,
                        required:true
                    }
                ]
            }
        ]
    },
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