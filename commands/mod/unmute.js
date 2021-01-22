const ms = require("ms");
//const Ssentry = require("@sentry/node");
//const Ttracing = require("@sentry/tracing");

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

exports.run = async (client, message, args) => {
    let tounmute =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]) ||
    match(args.join(" ").toLowerCase(), message.guild);

  //!tempmute @user 1s/m/h/d


  if(!tounmute) return message.reply("Couldn't find user.");

  let muterole = message.guild.roles.cache.find(role => role.name === "muted");
  //start of create role
  if(!muterole){
    try{
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    }catch(e){
        //Sentry.captureException(e);
      console.log(e.stack);
    }
  }
  //end of create role
  //let mutetime = args[1];
  //if(!mutetime) return message.reply("You didn't specify a time!");

  await(tounmute.roles.remove(muterole.id));
  return message.channel.send(`<@${tounmute.id}> has been unmuted!`);

  //setTimeout(function(){
  //  tounmute.roles.remove(muterole.id);
  //   message.channel.send(`<@${tounmute.id}> has been unmuted!`);
  //}, ms(mutetime));
}
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['unsilence'],
  perms: [
      'MANAGE_MESSAGES'
  ]
};

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name: "unmute",
  description: "Unmute a user",
  usage: "unmute [user]"
};