const canvacord = require("canvacord");
const { MessageAttachment } = require("discord.js");

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
    message.channel.startTyping();
    let user =
        message.mentions.users.first() ||
        client.users.cache.get(args[0]) ||
        match(args.join(" ").toLowerCase(), message.guild) ||
        message.author;
    
    const db_user = await client.dbgetuser(client, message.guild.id, user.id);
    let level = db_user.rank.level || 0;
    level = level.toString();

    let exp = db_user.rank.exp || 0;
    let neededXP = Math.floor(Math.pow(level / 0.1, 2));

    let rank = 2
    rank = rank.toString();

    let img = await canvacord.rank({
        username: user.username,
        discrim: user.discriminator,
        currentXP: exp.toString(),
        neededXP: neededXP.toString(),
        rank,
        level,
        avatarURL: user.displayAvatarURL({ format: "png" }),
        background: "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?ixlib=rb-1.2.1&w=1000&q=80"
      });
    message.channel.send(new MessageAttachment(img, "rank.png"));

    message.channel.stopTyping();
    
    
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['xp','showrank','showxp'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"rank",
    description: "Shows the rank and xp of a given user",
    usage: "!rank (user)"
};
