exports.run = (client, message, args) => {
    if(message.author.id !== '325893549071663104') return message.channel.send("Oops looks like you dont have the right permissions :(");
    let activity = args[0]
    args.shift();
    client.user.setActivity(args.join(' '), {type: activity})


}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['setstatus', 'changestatus'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"status",
    description: "a debug command",
    usage: "no usage"
};