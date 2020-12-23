exports.run = (client, message, args) => {
    if(message.author.id !== client.config.master) return message.channel.send("Oops looks like you dont have the right permissions :(");
    
    try {
        let toSay = args.join()
        client.guilds.cache.forEach((guild) => {
            if(guild.systemChannel){
                guild.systemChannel.send(toSay)
            } else{
                message.channel.send(`Failed at guild: "${guild.name}" (${guild.id}) `)
            }
        });
    }
    catch (err) {
        console.log("Could not send message to a (few) guild(s)!");
    }


}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"broadcast",
    description: "a debug command",
    usage: "no usage"
};