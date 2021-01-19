const  Guild = require('../../database/schemas/Guild');

exports.run = async (client, message, args, dbguild) => {
    let allperms=[
        "administrator",
        "create_instant_invite",
        "kick_members",
        "ban_members",
        "manage_channels",
        "manage_guild",
        "add_reactions",
        "view_audit_log",
        "priority_speaker",
        "stream",
        "view_channel",
        "send_messages",
        "send_tts_messages",
        "manage_messages",
        "embed_links",
        "attach_files",
        "read_message_history",
        "mention_everyone",
        "use_external_emojis",
        "view_guild_insights",
        "connect",
        "speak",
        "mute_members",
        "deafen_members",
        "move_members",
        "use_vad",
        "change_nickname",
        "manage_nicknames",
        "manage_roles",
        "manage_webhooks",
        "manage_emojis"
    ]
    
    let modperms=[
        "create_instant_invite",
        "kick_members",
        "ban_members",
        "add_reactions",
        "manage_messages",
        "change_nickname",
        "manage_nicknames",
        "manage_roles",
        "manage_emoji"
    ]
    
    let role = message.mentions.roles.first()
    if(['list','view'].includes(args[0].toLowerCase()) || (!args[0] && !role)){
        if(!role){
            return message.channel.send('Please mention a role to view the perms of')
        }
        
        //let dbguild = await client.getDbGuild(message.guild.id)

        if(dbguild.roleperms){
            if(dbguild.roleperms[role.id]){
                return message.channel.send(`Permissions for the role ${role}: 
\`${dbguild.roleperms[role.id].join(',\n')}\``)
            } else{
                return message.channel.send('No permissions have been set for '+role)
            }
        }
        else{
            return message.channel.send('No permission roles set up for this server')
        }

    }

    else if(['set'].includes(args[0].toLowerCase())){
        if(!role){
            return message.channel.send('Please mention a role to set the permissions to.')
        } 

        let perms = [];
        args.forEach(arg =>{ 
            console.log(arg.toLowerCase())
            let perm = allperms.includes(arg.toLowerCase())
            console.log(perm)
            if(perm){
                perms.push(arg.toLowerCase())
            } else if(!perm && ['mod', 'moderator'].includes(arg.toLowerCase())){
                perms = perms.concat(modperms);
            } else{
                
            }
        })

        
        if(!perms){
            return message.channel.send(`The permission does not seem to be valid. To view all valid permissions, type \`${client.config.prefix}roleperms perms\``)
        }
        console.log(perms)
        Guild.findOneAndUpdate({id:message.guild.id},{['roleperms.'+role.id]: perms })
        
        
    }
    
    else if(['del', 'delete'].includes(args[0].toLowerCase())){
        if(!role){
            return message.channel.send('Please mention a role to delete the permissions of.')
        } 
        let dbguild =  await Guild.findOneAndUpdate({id:message.guild.id},{['roleperms.'+role.id]: undefined })
        
        
    }


    else if(['perms', 'permissions'].includes(args[0].toLowerCase())){
        return message.channel.send('To assign perms, you can iether add `mod` to add moderation perms, or ad perms seperately. \n All perms are: \n\`'+allperms.join(',\n')+ '\`')
    }

    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['permroles','permissionroles','rolepermissions'],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path");
const { concat } = require('ffmpeg-static');
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"roleperms",
    description: "Ping the bot",
    usage: "roleperms (set/delete/list/perms) (permision name, \"mod\") (role)"
};
