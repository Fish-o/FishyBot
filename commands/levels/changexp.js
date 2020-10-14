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




exports.run = async (client, message, args) => {
    const user =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild) ||
        message.author;


    let modifier = 'exp';

    if(args.map(arg => arg.toUpperCase()).includes('levels') || args.map(arg => arg.toUpperCase()).includes('level') || args.map(arg => arg.toUpperCase()).includes('lvl')|| args.map(arg => arg.toUpperCase()).includes('lvls')){
        modifier='lvl';
    } else if(args.map(arg => arg.toUpperCase()).includes('exp') || args.map(arg => arg.toUpperCase()).includes('xp') || args.map(arg => arg.toUpperCase()).includes('experience')){
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



    const guild = message.guild;
    const dbGuild = await Guild.findOne({id:guild.id})
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

        while(newExp >= neededXP){
            newLvl += 1;
            newExp -= neededXP
            neededXP = Math.floor(Math.pow(newLvl / 0.5, 2))
        }
    } else if(modifier == 'lvl'){
        newLvl += amount;
    }

    let msg = await message.channel.send(`${user.toString}'s level will be set to ${newLvl} and experience to ${newExp}.`)
    msg.react('✔️');
    msg.react('❌');
    let collected = await msg.awaitReactions((reaction, emojiuser) => emojiuser.id == message.author.id && ['✔️', '❌'].includes(reaction.emoji), {max:1, time:30000})
     
    if(collected.first()){
            var emoji = collected.first();
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
    guildOnly: false,
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
    usage: "!addxp (member) (amount)"
};
