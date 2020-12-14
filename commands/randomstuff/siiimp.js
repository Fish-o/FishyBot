let simp_responses = [
"Hey look, @ is a simp!",
"Haha, look @ is a simp!",
"Haha @ is a simp",
"@ is a simp guys!",
"@ is a SIMP!!",
"Guys look, @is a simp",
"Hey, i found a simp! It is @!",
"Hey @, ur a simp",
"Hey @, you are a simp!",
"Hey @, be less of a simp",
"Hey! @! Dont be such a simp!",
"Stop simping @!",
"@ stop simping",
"@ should really stop simping",
"I think @ might be the biggest simp of this discord server!",
"@ should really calm down, dont be such a simp @!",
"@ should not simp so much.",
"Buh"

]


function match(msg, i) {
    if (!msg) return undefined;
    if (!i) return undefined;
    let user = i.members.cache.find(
        m =>
            m.user.username.toLowerCase().startsWith(msg) ||
            m.user.username.toLowerCase() === msg ||
            m.user.username.toLowerCase().includes(msg) ||
            m.displayName.toLowerCase().startsWith(msg) ||
            m.displayName.toLowerCase() === msg ||
            m.displayName.toLowerCase().includes(msg)
    );
    if (!user) return undefined;
    return user;
}

exports.run = async (client, message, args, db_guild) => {
    let member =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]) ||
    match(args.join(" ").toLowerCase(), message.guild);

    if(!member){
        return message.channel.send('Mention someone to call them out for simping!')
    }
    console.log('hasntcrasched')
    //let db_guild = await client.getDbGuild(message.guild.id, 'acc');
    console.log('hasntcrasched2')
    if(['clear', 'remove', 'delete'].includes(args[0].toLowerCase()) ){
        console.log('hasntcrasched3')
        if(message.member.hasPermission('MANAGE_ROLES')){
            await client.updatedb({id:message.guild.id}, {['randomstuff.simpcounter.'+member.id]: 0})
            message.channel.send(`${member}'s simp counter has been rest. (prev: ${db_guild.randomstuff.simpcounter[member.id] || '0'})`)
        }else{
            message.channel.send('To clear someones simp count, they need to have the `MANAGE_ROLES` permission.')
        }

    }
    console.log('hasntcrasched4')
    db_guild = await client.getDbGuild(message.guild.id, 'acc')
    console.log(db_guild)
    console.log(db_guild.randomstuff.simpcounter)
    console.log(member.id)
    if(!db_guild.randomstuff.simpcounter[member.id]){
        await client.updatedb( {id:message.guild.id}, {['randomstuff.simpcounter.'+member.id]: 1});
        message.channel.send(`${member} has become a simp! (count: 1)`)

        
    }else{
        await client.updatedb( {id:message.guild.id}, {['randomstuff.simpcounter.'+member.id]: (db_guild.randomstuff.simpcounter[member.id]+1)});
        message.channel.send(`${(simp_responses[Math.floor(Math.random() * simp_responses.length)]).split('@').join(member)} (count:${db_guild.randomstuff.simpcounter[member.id]+1})`)
    }



}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        
    ]
  };
  
const { DiscordAPIError } = require("discord.js");
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"simp",
    description: "Call someone out for being a simp",
    usage: "simp (member) [clear]"
};
