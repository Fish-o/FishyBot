const  Guild = require('../../database/schemas/Guild');
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
    return user.user;
}




exports.run = async (client, message, args, dbGuild) => {
    const user =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild)

    if(!user){
        await Guild.updateOne({id:guild.id}, {$pull: {'levels.members': user.id}})
    }
    if(user.bot){
        return message.channel.send('You can not change the xp of a bot')
    }


    
    const guild = message.guild;
    //const dbGuild = await Guild.findOne({id:guild.id})
    if(!(user.id in dbGuild.levels.members)){
        dbGuild = await Guild.updateOne({id:guild.id}, {['levels.members.'+user.id]: {level:1, exp:1}}, {new: true})
    }
    const dbUserLevelData = dbGuild.levels.members[user.id];
    let level = dbUserLevelData.level;
    let exp = dbUserLevelData.exp;
    let neededXP = Math.floor(Math.pow(level / 0.5, 2));

    exp;
    level;



    let msg = await message.channel.send(`${user.toString()}'s rank will be **entirely reset**, are you sure you want to do this?.`)
    msg.react('✔️');
    msg.react('❌');
    let collected = await msg.awaitReactions((reaction, emojiuser) => emojiuser.id == message.author.id && ['✔️', '❌'].includes(reaction.emoji.toString()), {max:1, time:30000})
     
    if(collected.first()){
            var emoji = collected.first().emoji.toString();

            if(emoji == '✔️'){
                await Guild.updateOne({id:guild.id}, {['levels.members.'+user.id]: undefined})
                return message.channel.send(`${user.toString()} rank has been reset (prev: lvl ${level}, exp ${exp})`)
            } else if (emoji == '❌'){
                return message.channel.send('Stopped')
            } else {
                return message.channel.send('Aborted')
            }
            msg.delete();
    } else {
        return message.channel.send('Stopped')
    }





}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['deleteexp', 'deletexp', 'prunerank', 'prunexp', 'resetrank', 'resetexp', 'resetxp'],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"deleterank",
    description: "Lets an admin reset a users rank",
    usage: "deleterank (member)"
};
