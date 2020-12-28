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

let command = async function(client, member, sender, guild, action){
    return new Promise(async(resolve, reject)=>{
        let guildId = guild.id
        let db_guild = await client.getDbGuild(guild.id);

        if(['list', 'view', 'leaderboard', 'lb'].includes(action.toLowerCase())){
            member = member || sender;

            let msg = 
    `
    **Simpcounter for **\`${guild.name}\`:`
            
            let arr = [];
            var prop;
            for (prop in db_guild.randomstuff.simpcounter) {
                if (db_guild.randomstuff.simpcounter.hasOwnProperty(prop)) {
                    arr.push({
                        'key': prop,
                        'value': db_guild.randomstuff.simpcounter[prop]
                    });
                }
            }
            let sorted = arr.sort(function(a, b) {
                a = a.value
                b = b.value
                if(a < b) return 1;
                else if(a > b) return -1;
                else if(a == b) {
                    return 0
                }
                else return 0;
            });


            sorted = sorted.slice(0,9)
            let userRank = sorted.find(lbMember => lbMember.key == member.id)
            let count = db_guild.randomstuff.simpcounter[member.id] || 0;
            if(!userRank){
                sorted = sorted.slice(0,8)
                sorted.forEach( (userRank, index) =>{
                    index ++
                    let lb_member =  guild.members.cache.get(userRank.key);
                    if(!lb_member){
                        msg = msg.concat(`\n[\`${index}\`] _${userRank.key}_ (member not found) - Count: ${userRank.value}`)
                    } else {
                        msg = msg.concat(`\n[\`${index}\`] _${lb_member.nickname || lb_member.user.tag }_ - Count: **${userRank.value}**`)
                    }
                })
                let rank = sorted.indexOf(sorted.find(lbMember => lbMember.key == member.id))+1 || 0
                msg = msg.concat(`\n\n[\`${rank}\`] _**${messag.nickname || member.tag }**_ - Count: **${count}**`)
            }else if(userRank){
                sorted = sorted.slice(0,9)
                sorted.forEach( (userRank, index) =>{
                    index ++
                    let lb_member =  guild.members.cache.get(userRank.key);
                    if(!lb_member){
                        msg = msg.concat(`\n[\`${index}\`] _${userRank.key}_ (member not found) - Count: ${userRank.value.level}`)
                    } else {
                        if(lb_member.id == sender.id){
                            msg = msg.concat(`\n[\`${index}\`] _**${lb_member.nickname || lb_member.user.tag }**_ - Count: **${userRank.value}**`)
                        }else{
                            msg = msg.concat(`\n[\`${index}\`] _${lb_member.nickname || lb_member.user.tag }_ - Count: **${userRank.value}**`)
                        }
                    }
                })
            }
            if(msg){
                return resolve(msg)
            }

        }


        else if(!member){
            return resolve('Mention someone to call them out for simping!')
        }

        else if(['clear', 'remove', 'delete'].includes(action.toLowerCase()) ){
            if(member.hasPermission('MANAGE_ROLES')){
                await client.updatedb({id:guildId}, {['randomstuff.simpcounter.'+member.id]: 0})
                return resolve(`${member}'s simp counter has been rest. (prev: ${db_guild.randomstuff.simpcounter[member.id] || '0'})`)
            }else{
                return resolve('To clear someones simp count, they need to have the `MANAGE_ROLES` permission.')
            }

        }
        
        else{
            db_guild = await client.getDbGuild(guildId, 'acc')
            if(!db_guild.randomstuff.simpcounter[member.id]){
                await client.updatedb( {id:guildId}, {['randomstuff.simpcounter.'+member.id]: 1});
                return resolve(`${member} has become a simp! (count: 1)`)

                
            }else{
                await client.updatedb( {id:guildId}, {['randomstuff.simpcounter.'+member.id]: (db_guild.randomstuff.simpcounter[member.id]+1)});
                return resolve(`${(simp_responses[Math.floor(Math.random() * simp_responses.length)]).split('@').join(member)} (count:${db_guild.randomstuff.simpcounter[member.id]+1})`)
            }
        }
    });
}
exports.command = command;

exports.run = async (client, message, args, db_guild) => {
        let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild);


        message.channel.send(await command(client, member, message.member, message.guild, args[0]))
    

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
