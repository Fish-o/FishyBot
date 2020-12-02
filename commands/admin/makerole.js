exports.run = (client, message, args) => {
    let whole_args = args.join(' '); 
    
    let role = message.guild.roles.create()
    message.channel.send('The role')
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['MANAGE_ROLES'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"makerole",
    description: "Create a role without any permisions and a specified color",
    usage: "makerole (rolename) (rolecolor)"
};
