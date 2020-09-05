exports.run = (client, message, args) => {

    if(!args[0]){
        return message.channel.send("Stopped, please enter a channel, or enter `off`")
    }
    const guild = message.guild; 
    channel = message.mentions.channels.first();
    if(args[0].toLowerCase() == 'off' || args[0].toLowerCase() == 'stop' || args[0].toLowerCase() == 'close'){
        guild.fetchWebhooks()
        .then(webhooks => {
            const created_webhooks = webhooks.find(webhook => webhook.client.id == client.id)
            if(created_webhooks){
                created_webhooks.forEach(webhook => {
                    webhook.delete()
                });
                var query = {id: message.guild.id};
                const locate_string = "logging"
                const db_data = undefined;
                var values = { $set: {[locate_string]:db_data}}
                client.updatedb(query, value, 'Stopped logging', message.channel)
            }

        }).catch(console.error);

    } else if (channel){
        guild.fetchWebhooks()
            .then(webhooks => {
                const created_webhooks = webhooks.filter(webhook => webhook.client.user.id == client.user.id)
                console.log(created_webhooks)
                console.log(JSON.stringify(created_webhooks))
                if(created_webhooks){
                    created_webhooks.forEach(webhook => {
                        webhook.delete()
                    });
                }
                channel.createWebhook('FishyBot-log', {
                        avatar: client.user.avatarURL,
                        reason: 'used to post log events'
                    })
                    //.then(webhook => webhook.edit("FishyBot Logging", )
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
                        var values = { $set: {[locate_string]:db_data}}
                        client.updatedb(query, value, 'Started logging!', wb)
                    }).catch(console.error)
            }).catch(console.error);
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['logging'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"log",
    description: "",
    usage: "!log [channel / 'off']"
};


