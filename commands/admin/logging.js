exports.run = (client, message, args) => {
    channel = message.mentions.channels.first();

    if(args[0].toLowerCase() == 'off' || args[0].toLowerCase() == 'stop' || args[0].toLowerCase() == 'close'){

    } else if (channel){
        
        channel.createWebhook("FishyBot Logging")
        .then(webhook => webhook.edit("FishyBot Logging", client.user.avatarURL)
        .then(wb => {
            message.author.send(`Here is your webhook https://canary.discordapp.com/api/webhooks/${wb.id}/${wb.token}`)
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


