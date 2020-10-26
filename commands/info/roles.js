const Discord = require('discord.js')
exports.run = (client, message, args) => {
    const guild = message.guild;
    const RoleManager = guild.roles;
    const RoleCache = RoleManager.cache;

    if(!args[0]){
        function compare(a, b) {
            if (a.position < b.position) {
                return -1;
            }else if (a.position > b.position) {
                return 1;
            } else{
                return 0;
            }
        }

        let sortedRole = Array.from(RoleCache.values()).sort(compare).reverse();
        
        let Text = ``
        sortedRole.forEach(role => {
            let append = `${role.toString()} `
            if(role.permissions.has('MENTION_EVERYONE') && !role.permissions.has('ADMINISTRATOR') && !role.permissions.has('MANAGE_MESSAGES') && !role.permissions.has('MANAGE_CHANNELS')){
                append += `- ⚠️ Can Mention Everyone`
            }
            Text += (append +'\n')
        })
        const Embed = new Discord.MessageEmbed()
            .setTitle(`Roles for ${message.guild.name}`)
            .setColor('RANDOM')
            .setDescription(Text)

        message.channel.send(Embed)

    } else {
        if(!message.mentions.roles.first() && !RoleCache.has(args[0])){
            message.channel.send('Please mention a valid role')
        } else {
            let role = message.mentions.roles.first() || RoleCache.get(args[0]);
            const Embed = new Discord.MessageEmbed()
                .setTitle(`Role: ${role.name}`)
                .setColor('RANDOM');
            if(role.permissions.has('ADMINISTRATOR')){
                Embed.setDescription(`ADMINISTRATOR (everything)`)
            }else{
                Embed.setDescription(`${role.permissions.toArray().join('\n')}`)
            }
            message.channel.send(Embed)
        }
    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['role','roles'],
    perms: [
        "MANAGE_ROLES"
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"roles",
    description: "Displays all roles of the server, and lets you see specific perms of a single roleS",
    usage: "roles (role)"
};
