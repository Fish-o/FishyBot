const ms = require("ms");

exports.run = async (bot, message, args) => {

  //!tempmute @user 1s/m/h/d
  if(!message.member.hasPermission("ADMINISTRATOR")){
    return message.channel.send("You don't have the permissions to use this command!");
  }
  let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if(!tounmute) return message.reply("Couldn't find user.");
  if(tounmute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't unmute them!");
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
      console.log(e.stack);
    }
  }
  //end of create role
  //let mutetime = args[1];
  //if(!mutetime) return message.reply("You didn't specify a time!");

  await(tounmute.roles.remove(muterole.id));
  message.reply(`<@${tounmute.id}> has been unmuted!`);

  //setTimeout(function(){
  //  tounmute.roles.remove(muterole.id);
  //   message.channel.send(`<@${tounmute.id}> has been unmuted!`);
  //}, ms(mutetime));
}
exports.conf = {
  enabled: true,
  guildOnly: false,
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
  usage: "!unmute [user]"
};