const Discord = require('discord.js');
exports.run = (client, message, args) => {

    if(!args[0]){
        return message.channel.send("Stopped, please enter a channel, or enter `off`")
    }
    const guild = message.guild; 
    channel = message.mentions.channels.first();
    if(args[0].toLowerCase() == 'off' || args[0].toLowerCase() == 'stop' || args[0].toLowerCase() == 'close'){
        guild.fetchWebhooks()
        .then(webhooks => {
            const created_webhooks = webhooks.filter(webhook => webhook.client.user.id == client.user.id)
            if(created_webhooks){
                created_webhooks.forEach(webhook => {
                    webhook.delete()
                });
            }
            var query = {id: message.guild.id};
            const locate_string = "logging"
            const db_data = undefined;
            var value = { $set: {[locate_string]:db_data}}
            client.updatedb(query, value, 'Stopped logging', message.channel)

        }).catch(console.error);

    } else if (channel){
        guild.fetchWebhooks()
            .then(webhooks => {
                const created_webhooks = webhooks.filter(webhook => webhook.client.user.id == client.user.id);
                if(created_webhooks){
                    created_webhooks.forEach(webhook => {
                        webhook.delete()
                    });
                }
                channel.createWebhook('FishyBot-log', {
                        reason: 'used to post log events',
                        avatar: client.user.displayAvatarURL()
                    })
                    //.then(webhook => webhook.edit({avatar: client.user.avatarURL()} ))
                    .then(wb => {
                        var query = {id: message.guild.id};
                        const locate_string = "logging"
                        const db_data = {
                            webhook: {
                                id: wb.id,
                                token: wb.token
                            }, 
                            channel_id: channel.id
                        }
                        var value = { $set: {[locate_string]:db_data}}
                        client.updatedb(query, value, 'Started logging!', wb)
                    }).catch(console.error)
            }).catch(console.error);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['logging'],
    perms: ['ADMINISTRATOR'
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"log",
    description: 
`Logs events to a channel,
current events include:

GuildMemberUpdate:
    unknown
    addedRole
    removedRole
    username
    nickname
    avatar

messageDelete

more will be added over time.`,
    usage: "!log [channel / 'off']"
};


