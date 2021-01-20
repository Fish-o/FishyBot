const Discord = require('discord.js');


const  User = require('../database/schemas/User')
const  Guild = require('../database/schemas/Guild')
//const Ssentry = require("@sentry/node");
const Ttracing = require("@sentry/tracing");
const MongoClient = require('mongodb').MongoClient;



function checkRoles(db_guild, guild){
    let wrong = []
    let ok = []
    let names = []
    let roles = []
    db_guild.defaultroles.forEach(roleid =>{
        let guild_role = guild.roles.cache.get(roleid)
        if(!guild_role){
            wrong.push(roleid)
        }else{
            ok.push(roleid)
            names.push(guild_role.name)
            roles.push(guild_role)
        }  
    })
    return { wrong, ok, names, roles }
} 

exports.event = async (client, member) =>{
	

    const uri = client.config.dbpath;
	let current_member = member

    let guild = member.guild;
    var guildID = guild.id;


    await User.findOneAndUpdate({discordId:member.id },{
        id:guildID, 
        discordTag:member.user.tag,
        avatar:member.user.avatar
    }, { upsert: true, setDefaultsOnInsert: true })

	// Get guilds
    await Guild.findOneAndUpdate({id:guild.id}, { $push: {memberlist: member.user.id}})
    

    let db_guild = await Guild.findOne({id: guildID});




    // Default roles
    let {ok, wrong, roles, names} = checkRoles(db_guild, guild);
    if(roles.length > 0){
        member.roles.add(roles, 'Default Roles added on join')
    }
    if(wrong.length > 0){
        await Guild.findOneAndUpdate({id: message.guild.id}, {defaultroles: ok} )
    }
    
    
    
    
    
    
    
    
    // Get guilds
    let value = db_guild;

    if(value.member_count_channel){
        let membercount_channel = guild.channels.cache.get(value.member_count_channel);
        if(membercount_channel){
            let membercount = guild.members.cache.filter(member => !member.user.bot).size;
            membercount_channel.setName(client.config.membercountcannelname+membercount)
        }
    }

    if(!value.joinMsg || !value.joinMsg.channelId){}
    else{
        
        //const member = member;

        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.cache.find(ch => ch.id === value.joinMsg.channelId);

        // Do nothing if the channel wasn't found on this server
        if (channel){

            if(value.joinMsg.dm != '' && value.joinMsg.dm){
                
                member.send(value.joinMsg.dm.replace("{name}", member));
            }
            if(value.joinMsg.message) return channel.send(value.joinMsg.message)
            value.joinMsg.title
            value.joinMsg.desc

            // Send the message, mentioning the member
            
            
            let sicon = member.user.displayAvatarURL();
            let serverembed = new Discord.MessageEmbed();
            serverembed.setColor(value.joinMsg.color);
            serverembed.setThumbnail(sicon);
            serverembed.addField(value.joinMsg.title.b.replace("{name}", member.user.username)  ,value.joinMsg.title.s.replace("{name}", member));
            if(value.joinMsg.desc){
                serverembed.addField(value.joinMsg.desc.b.replace("{name}", member.user.username)   ,value.joinMsg.desc.s.replace("{name}", member));
            }
            try{
                channel.send(serverembed);
            } catch(err){
                //Sentry.captureException(err);
                console.log(err);
                console.log('Error in join message');
            }
        }
    }
}

exports.conf = {
    event: "guildMemberAdd"
};