const  Guild = require('../../database/schemas/Guild');


function checkRoles(db_guild, guild){
    let wrong = []
    let ok = []
    let names = []
    db_guild.defaultroles.forEach(roleid =>{

        if(!guild.roles.cache.get(roleid)){
            wrong.push(roleid)
        }else{
            ok.push(roleid)
            names.push(guild.roles.cache.get(roleid).name)
        }  
    })
    return { wrong, ok, names }
} 


exports.run = async (client, message, args) => {
    

    var lowercase = [];
    for (var i = 0; i < args.length; i++) {
        lowercase.push(args[i].toLowerCase());
    }

    if(lowercase.includes('clear')){
        await Guild.findOneAndUpdate({id:message.guild.id}, {defaultroles:[]});
        message.channel.send('Removed all default roles, people with the role will still have it.')
        

    } else if(lowercase.includes('add')){
        if(!message.mentions.roles.first()){
            return message.channel.send('Please enter a valid role')
        }
        const role = message.mentions.roles.first()
        await Guild.findOneAndUpdate({id:message.guild.id}, {$push: {defaultroles: role.id}})
        message.channel.send(`Added the role: \`${role.name}\` as a default role`)


    } else if(lowercase.includes('set')){       
        if(!message.mentions.roles.first()){
            return message.channel.send('Please enter a valid role')
        }
        const role = message.mentions.roles.first()
        await Guild.findOneAndUpdate({id:message.guild.id}, {defaultroles: [role.id]})
        message.channel.send(`\`${role.name}\` has been set as the default role`)


    } else if(lowercase.includes('list')){
        let db_guild = await Guild.findOne({id:message.guild.id})
        let {ok, wrong, names} = checkRoles(db_guild, message.guild)
        if(wrong.length > 0){
            await Guild.findOneAndUpdate({id: message.guild.id}, {defaultroles: ok} )
        }
        message.channel.send(`Current default roles are: \`${names.join('`, `')|| 'none'}\``)
        

    } else{
        message.channel.send(`Please enter a valid action (clear/list/add/set)`)
    }



}


exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['default', 'defaultroles'],
    perms: [
        "MANAGE_ROLES"
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"defaultrole",
    description: "Set a default role. Default roles will be aplied to people who join.",
    usage: "f!defaultrole list/clear/add/set (role) "
};

