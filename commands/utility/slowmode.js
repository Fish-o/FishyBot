const ms = require("ms");
exports.run = async (client, message, args) => {
    let time = ms(args[0]+ " "+ args[1]);
    let channel = message.mentions.channels.first() || message.channel;
    if(time){
        args.shift();
        args.shift();
    } else{
        time = ms(args[0]);
        if(time){
            args.shift();
        } else{
            time = 0;
        }
    }
    if(time > 6*60*60*1000){
        return message.channel.send(`The time given (${ms(time)}) exceeded the limit of 6 hours`)
    }
    channel.setRateLimitPerUser(time/1000, `Member ${message.author.name} requested to change the slowmode`);
    message.channel.send('Set the new slowmode to: '+ ms(time))
}


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['setslowmode', 'slow'],
    perms: [
        'MANAGE_CHANNELS'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"slowmode",
    description: "Used for setting the slowmode of a specific channel",
    usage: "slowmode (time) <channel>"
};
