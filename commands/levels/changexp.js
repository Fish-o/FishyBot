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
        message.guild.members.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild) ||
        message.author;

    if(user.bot){
        return message.channel.send('You can not change the xp of a bot')
    }
    let modifier = 'exp';

    if(args.map(arg => arg.toLowerCase()).includes('levels') || args.map(arg => arg.toLowerCase()).includes('level') || args.map(arg => arg.toLowerCase()).includes('lvl')|| args.map(arg => arg.toLowerCase()).includes('lvls')){
        modifier='lvl';
    } else if(args.map(arg => arg.toLowerCase()).includes('exp') || args.map(arg => arg.toLowerCase()).includes('xp') || args.map(arg => arg.toLowerCase()).includes('experience')){
        modifier='exp';
    }

    let amount = undefined;

    args.forEach(arg => {
        if(!isNaN(arg)){
            amount = Math.floor(arg);
        }
    });

    if(!amount){
       return message.channel.send('Could not find a valid amount to change someones xp with') 
    } else if(!user){
        return message.channel.send('Could not find a valid user to add the amount to')
    }

    if(amount > 1000000){
        return message.channel.send('to high dumbass')
    }


    const guild = message.guild;
    //const dbGuild = await Guild.findOne({id:guild.id})
    if(!(user.id in dbGuild.levels.members)){
        dbGuild = await Guild.update({id:guild.id}, {['levels.members.'+user.id]: {level:1, exp:1}}, {new: true})
    }
    const dbUserLevelData = dbGuild.levels.members[user.id];
    let level = dbUserLevelData.level;
    let exp = dbUserLevelData.exp;
    let neededXP = Math.floor(Math.pow(level / 0.5, 2));

    let newExp = exp;
    let newLvl = level;

    if(modifier == 'exp'){
        
        newExp += amount;
        if(Math.sign(newExp) == -1){
            while(newExp <= 0 && newLvl > 1){
                newLvl -= 1;
                newExp += Math.floor(Math.pow(newLvl / 0.5, 2))
            }
        } else {
            while(newExp >= neededXP){
                newLvl += 1;
                newExp -= neededXP
                neededXP = Math.floor(Math.pow(newLvl / 0.5, 2))
            }
        }
    } else if(modifier == 'lvl'){
        newLvl += amount;
    }

    if(Math.sign(newExp) == -1){
        newExp = 1
    }

    if(Math.sign(newLvl) == -1){
        newLvl = 1
    }

    let msg = await message.channel.send(`${user.toString()}'s level will be set to ${newLvl} and experience to ${newExp}.`)
    msg.react('✔️');
    msg.react('❌');
    let collected = await msg.awaitReactions((reaction, emojiuser) => emojiuser.id == message.author.id && ['✔️', '❌'].includes(reaction.emoji.toString()), {max:1, time:30000})
     
    if(collected.first()){
            var emoji = collected.first().emoji.toString();

            if(emoji == '✔️'){
                await Guild.update({id:guild.id}, {['levels.members.'+user.id]: {level:newLvl, exp:newExp}})
                message.channel.send('Done!')
            } else if (emoji == '❌'){
                message.channel.send('Stopped')
            } else {
                message.channel.send('Aborted')
            }
            msg.delete();
    } else {
        message.channel.send('Stopped')
    }





}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['addexp','changexp','changeexp','changelevel','changelvl'],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"addxp",
    description: "Lets an admin add xp to a user",
    usage: "addxp (member) (amount)"
};
