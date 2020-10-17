
const  User = require('../database/schemas/User');
const  Guild = require('../database/schemas/Guild');
const cooldown = new Set();
const cooldown_time = 30;
const Discord = require('discord.js')
exports.event = async (client, message) =>{
    if (message.author.bot) return;
    if (message.webhookID) return;
    if (message.channel instanceof Discord.DMChannel) return;
    
    try{
            
        if (!cooldown.has(message.author.id)) {
            cooldown.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after some time
                cooldown.delete(message.author.id);
            }, 1000*cooldown_time);


            const member = message.member;
            const guild = message.guild;
            const dbGuild = await Guild.findOne({id:guild.id})
            console.log(dbGuild.settings.get('levels'))
            if(dbGuild.settings.get('levels') == false){
                return;
            } else {
                if(!(member.id in dbGuild.levels.members)){
                    return await Guild.update({id:guild.id}, {['levels.members.'+member.id]: {level:1, exp:1}})
                }


                const dbUserLevelData = dbGuild.levels.members[member.id];
                let level = dbUserLevelData.level;
                let exp = dbUserLevelData.exp;

                let neededXP = Math.floor(Math.pow(level / 0.5, 2));

                if(exp >= neededXP){

                    level = level+1
                    exp = 1
                    await Guild.update({id:guild.id}, {['levels.members.'+member.id]: {level, exp}})

                    let lvlUpMsg = dbGuild.levels.lvlUpMsg || `Congratulations {member}, you leveled up to level {level}`;
                    lvlUpMsg = lvlUpMsg.replace(/\{member\}/g, `<@${member.id}>`)
                    lvlUpMsg = lvlUpMsg.replace(/\{level\}/g, level)

                    if(dbGuild.levels.channel){
                        if(guild.channels.cache.has(dbGuild.levels.channel)){
                            guild.channels.cache.get(dbGuild.levels.channel).send(lvlUpMsg);
                        } else{
                            message.channel.send(`<@${member.id}> has leveld up to level ${level}, but i couldnt find the channel where this message was supposed to be sent to. Please contact an admin of your server. `)
                        }
                        
                    } else{
                        message.channel.send(lvlUpMsg)
                    }
                } else{
                    await Guild.update({id:guild.id}, {$inc: {['levels.members.'+member.id+'.exp']: 1}})
                }
            }
        }
    }
    catch(err) {
        console.log(err)
        console.log('An error has occured with the leveling system')
    }

}
exports.conf = {
    event: "message"
};
    