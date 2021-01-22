const  Guild = require('../../database/schemas/Guild')
/*
Need to deal with deleted channelss

*/
exports.run = async (client, message, args, dbGuild) => {
    if(['remove', 'rem', 'delete', 'del'].includes(args[0].toLowerCase())){
        let channelMention = message.mentions.channels.first();
        let channel = message.channel;
        if(channelMention && channelMention.type == 'text'){
            channel = channelMention;
        }

        await Guild.findOneAndUpdate({id:message.guild.id}, {['filters.'+channel.id]: undefined})
        return message.channel.send('Removed the filter')
    }

    else if(['set', 'change'].includes(args[0].toLowerCase())){
        args.shift()
        let channelMention = message.mentions.channels.first();
        let regextxt = args.join(' ');
        let channel = message.channel;
        if(channelMention && channelMention.type == 'text'){
            regextxt = regextxt.replace(channelMention.toString(), '').trim()
            channel = channelMention;
        }
        console.log(regextxt)
        console.log(args.join(' '))
        let isValid = true;
        try {
            new RegExp(regextxt);
        } catch(e) {
            isValid = false;
        }
        if(!isValid) return message.channel.send('The entered regex is not valid')
        await Guild.findOneAndUpdate({id:message.guild.id}, {['filters.'+channel.id]:regextxt})
        return message.channel.send('Changed the filter!')

    }

    else if(['list', 'view', 'display'].includes(args[0].toLowerCase())){
        let channelMention = message.mentions.channels.first();
        //let dbGuild = await client.getDbGuild(message.guild.id)
        if(channelMention){
            if(dbGuild.filters[channelMention.id]){
                return message.channel.send(`The filter for channel ${channelMention} is: _${dbGuild.filters[channelMention.id]}_`)
            }else{
                return message.channel.send(`No filter set up for the channel ${channelMention}`)
            }
        }else{
            let text = 'All filters for this server:\n'
            Object.keys(dbGuild.filters).forEach(channelid=>{
                if(channelid){
                    if(dbGuild.filters[channelid]){
                        text += `**${message.guild.channels.cache.get(channelid) || `${channelid} (channel not found)`}** => _${dbGuild.filters[channelid]}_\n`
                    }
                }
            })
            return message.channel.send(text)
        }
    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['setfiler', 'addfilter'],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path");
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"filter",
    description: "Add a text filter to a text channel",
    usage: "filter (set/list/remove) regex (channel)"
};
