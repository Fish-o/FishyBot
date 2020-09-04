exports.run = (client, message, args) => {

    if(!args[0]){
        return message.channel.send("Stopped, please enter a channel, or enter `off`")
    }

    channel = message.mentions.channels.first();
    if(args[0].toLowerCase() == 'off' || args[0].toLowerCase() == 'stop' || args[0].toLowerCase() == 'close'){

    } else if (channel){
        
        channel.createWebhook("FishyBot Logging")
        .then(webhook => webhook.edit("FishyBot Logging", client.user.avatarURL)
        .then(wb => {
            var query = {id: message.guild.id};
            const locate_string = "logging.webhook"
            const db_data = {
                webhook: {
                    id: wb.id,
                    token: wb.token
                }, 
                channel_id: channel.id
            }
            var values = { $set: {[locate_string]:db_data}}
            client.updatedb(query, value, 'Started logging!', message.channel)
        }).catch(console.error))
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


