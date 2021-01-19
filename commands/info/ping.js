exports.run = async (client, message, args) => {
    let beforeTime = Date.now()
    let msg = await message.channel.send('Pong...')
    msg.edit(
`Bot latency is \`${Date.now() - msg.createdTimestamp}ms\`. 
API Latency is \`${Math.round(client.ws.ping)}ms\`.
Your latency to the bot \`${(beforeTime - message.createdTimestamp )}ms\`.
`);
    return msg;
    
}

exports.interaction = async (client, interaction, args) => {
    let msg = await interaction.channel.send('Calculating....')
    
    interaction.send(
`Bot latency is \`${Date.now() - msg.createdTimestamp}ms\`. 
API Latency is \`${Math.round(client.ws.ping)}ms\`.
`);
msg.delete()
}



exports.conf = {
    enabled: true,
    guildOnly: false,
    interaction: {
        description: "Returns the latency of the bot",
        options: []
    },
    aliases: [],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"ping",
    description: "Ping the bot",
    usage: "ping"
};
