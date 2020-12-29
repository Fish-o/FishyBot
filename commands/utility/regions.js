

exports.run = (client, message, args) => {
    //return message.channel.send('This wont work for now, as the database is being worked on, sorry for the inconvenience.')
    
    client.emoji_data
    client.config
    

    var member = message.member

    if( message.mentions.users.first() && message.member.hasPermission("MANAGE_MESSAGES")){
        member = message.mentions.users.first()
    }
    
    /*const platforms = 
    {
        emoji_oculus : client.emojis.cache.get(emoji_data.oculus).toString(),
        emoji_nintendo :client.emojis.cache.get(emoji_data.nintendo).toString(),
        emoji_steam :   client.emojis.cache.get(emoji_data.steam).toString(),
        emoji_xbox :    client.emojis.cache.get(emoji_data.xbox).toString()
    };*/

    message.channel.send('Click on the emoji of the region you live clossest to.').then(sent => {
        for(let region in client.emoji_data.regions){
            sent.react(client.emoji_data.regions[region]);
        };
        
    
        const filter = (reaction, user) => user.id == message.author.id && Object.values(client.emoji_data['regions']).includes(reaction.emoji.name);
        sent.awaitReactions(filter, {max:1, time:30000}).then(collected =>{
            if(collected.first()){

                const emojiName = collected.first().emoji.name
                

                const regeon_rules_that_the_user_has = member.roles.cache.filter(role => Object.keys(client.emoji_data['regions']).includes(role.name))
                
                
                member.roles.remove(regeon_rules_that_the_user_has)

                const key = Object.keys(client.emoji_data['regions']).find(key => client.emoji_data['regions'][key] == emojiName)
                
                if(key !='remove'){

                        const role = message.guild.roles.cache.find(role => role.name === key);
                    
                    if(!role){
                        return message.channel.send(`The region role \` ${key} \` was not found, ask an admin to add: ${Object.keys(client.emoji_data['regions']).join(', ')}`)
                    }
                    member.roles.add(role);
                    message.channel.send(`Added \`${key}\` to **${message.author.tag}**`)
                }else{message.channel.send(`Removed region roles for **${message.author.tag}**`)}
                /*
                else{
                    member.roles.remove(Object.keys(client.emoji_data['regions']).filter(key => member.roles.cache.includes(emojiName)))
                    
                    /*Object.keys(client.emoji_data['regions'])
                        const role = message.guild.roles.cache.find(role => role.name === key);
                        role)

                    

                }*/
            }
            else{
                message.channel.send('Timed-out')
            }   


        });




    });
};


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['regions','regionroles'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"region",
    description: "Saves your region, so other people can see it with !userinfo",
    usage: "region"
};