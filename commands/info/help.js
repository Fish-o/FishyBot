

exports.run = async (client, message, args) => {


    let r = await client.helpFunc(client, args);
    if(r) message.channel.send(r);
    
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
    name:"help",
    description: "Shows the help page of any command, or a list of commands",
	usage: "help [command / category]"
};