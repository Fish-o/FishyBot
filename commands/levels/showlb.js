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


function sortObject(obj) {
    var arr = [];
    var prop;
    for (prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) {
        a = a.value
        b = b.value
        if(a.level < b.level) return 1;
        else if(a.level > b.level) return -1;
        else if(a.level == b.level) {
            if(a.exp < b.exp) return 1;
            else if(a.exp > b.exp) return -1;
            else return 0
        }
        else return 0;
    });
    return arr; // returns array
}


exports.run = async (client, message, args) => {

    let user = message.author;


    let dbGuild = await Guild.findOne({id:message.guild.id});
    if(!(user.id in dbGuild.levels.members)){
        dbGuild =  await Guild.update({id:message.guild.id}, {['levels.members.'+user.id]: {level:1, exp:1}}, {new: true})
    }

    const dbUserLevelData = dbGuild.levels.members[user.id];
    
    let level = dbUserLevelData.level;
    let exp = dbUserLevelData.exp;

    let msg = 
`
**Leaderboard for **\`${message.guild.name}\`:`
    let sorted = sortObject(dbGuild.levels.members);
    sorted = sorted.slice(0,9)
    let userRank = sorted.find(lbMember => lbMember.key == user.id)
    if(!userRank){
        sorted = sorted.slice(0,8)
        sorted.forEach( (userRank, index) =>{
            index ++
            let lb_member =  message.guild.members.cache.get(userRank.key);
            if(!lb_member){
                msg = msg.concat(`\n[\`${index}\`] _${userRank.key}_ (member not found) - Level: ${userRank.value.level}, Exp: ${userRank.value.exp}`)
            } else {
                msg = msg.concat(`\n[\`${index}\`] _${lb_member.nickname || lb_member.user.tag }_ - Level: **${userRank.value.level}**, Exp: **${userRank.value.exp}**`)
            }
        })
        let rank = sorted.indexOf(sorted.find(lbMember => lbMember.key == user.id))+1 || 0
        msg = msg.concat(`\n\n[\`${rank}\`] _**${message.member.nickname || user.tag }**_ - Level: **${level}**, Exp: **${exp}**`)
    }else if(userRank){
        sorted = sorted.slice(0,9)
        sorted.forEach( (userRank, index) =>{
            index ++
            let lb_member =  message.guild.members.cache.get(userRank.key);
            if(!lb_member){
                msg = msg.concat(`\n[\`${index}\`] _${userRank.key}_ (member not found) - Level: ${userRank.value.level}, Exp: ${userRank.value.exp}`)
            } else {
                if(lb_member.id == message.author.id){
                    msg = msg.concat(`\n[\`${index}\`] _**${lb_member.nickname || lb_member.user.tag }**_ - Level: **${userRank.value.level}**, Exp: **${userRank.value.exp}**`)
                }else{
                    msg = msg.concat(`\n[\`${index}\`] _${lb_member.nickname || lb_member.user.tag }_ - Level: **${userRank.value.level}**, Exp: **${userRank.value.exp}**`)
                }
            }
        })
    }
    if(msg){
        message.channel.send(msg)
    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['lb'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"leaderboard",
    description: "Shows the xp leaderboard of the server",
    usage: "!leaderboard"
};
