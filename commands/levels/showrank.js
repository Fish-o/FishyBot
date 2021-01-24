const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");
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

//const Ssentry = require("@sentry/node");
//const Ttracing = require("@sentry/tracing");


exports.run = async (client, message, args, dbGuild) => {
    message.channel.startTyping();
    try{
        let user =
            message.mentions.users.first() ||
            message.guild.members.cache.get(args[0]) ||
            match(args.join(" ").toLowerCase(), message.guild) ||
            message.author;


        if(user.id == client.user.id){
            const canvacordrank = new canvacord.Rank()
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setCurrentXP(Math.floor(Math.random() * 99999999) + 1  )
            .setRequiredXP(99999999)
            .setRank(-1)
            .setLevel(Math.floor(Math.random() * 99999999) + 1)
            .setAvatar(user.displayAvatarURL({ format: "png" }));
            //background"https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&w=1000&q=80"
        
        
            let data = await canvacordrank.build();
            let msg = message.channel.send(new MessageAttachment(data, "rank.png"));

            message.channel.stopTyping();
            return msg;
        } else if(user.bot){
            message.channel.stopTyping();
            return message.channel.send('Bots dont have ranks')
        }
        let guild = message.guild;

        //let dbGuild = await Guild.findOne({id:message.guild.id});

        if(!(user.id in dbGuild.levels.members)){
            dbGuild =  await Guild.updateOne({id:guild.id}, {['levels.members.'+user.id]: {level:1, exp:1}}, {new: true})
        }

        const dbUserLevelData = dbGuild.levels.members[user.id];
        
        let level = dbUserLevelData.level;
        let exp = dbUserLevelData.exp;


        let sorted = sortObject(dbGuild.levels.members);
        
        let rank = sorted.indexOf(sorted.find(lbMember => lbMember.key == user.id))+1 || 0
        /*
        let topTen = sorted.slice(0,9);
        let inTopTen = topTen.find(toptenner => toptenner)
    */

        let neededXP = Math.floor(Math.pow(level / 0.5, 2));

        //let rank = 2
        

        const canvacordrank = new canvacord.Rank()
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setCurrentXP(exp)
            .setRequiredXP(neededXP)
            .setRank(rank)
            .setLevel(level)
            .setAvatar(user.displayAvatarURL({ format: "png" }));
            //background"https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&w=1000&q=80"
        
        
        let data = await canvacordrank.build();
        return message.channel.send(new MessageAttachment(data, "rank.png"));
    }
    catch(err){
        //Sentry.captureException(err);
        message.channel.send('something went wrong, please contact: '+client.config.author)
    } finally{
        message.channel.stopTyping();
    }
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['xp','showrank','showxp'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"rank",
    description: "Shows the rank and xp of a given user",
    usage: "rank (user)"
};
