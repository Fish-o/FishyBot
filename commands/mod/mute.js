const ms = require("ms");

exports.run = async (bot, message, args) => {

         const ms = require("ms");
        var args = message.content.slice(commandPrefix.length).trim().split(/ +/g);
        args.shift()

 //!tempmute @user 1s/m/h/d

  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
  if(!tomute) return message.reply("Couldn't find user.");
  //if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
  let muterole = message.guild.roles.cache.find(role => role.name === "muted");
  //start of create role
  if(!muterole){
    try{
        muterole = await message.guild.roles.create({
            data: {
                name: 'muted',
                color: '#707070',
            },
            reason: 'Used for muting people',
          })
        
        const overwrites =  [
            {
              id: muterole.id, 
              deny: ['SEND_MESSAGES','ADD_REACTIONS']
            }
          ]   
    
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(muterole.id, {
            SEND_MESSAGES:false,
            ADD_REACTIONS:false
        });
      });
    }catch(e){
      console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if(!mutetime) return message.reply("You didn't specify a time!");
  if (tomute = message.author.id)
  {
    return message.channel.send(`cant mute urself my guy`);
  }

  await(tomute.roles.add(muterole.id));
  message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);
  tomute.send(`you have been muted for ${ms(ms(mutetime))}`)

  setTimeout(function(){
    tomute.roles.remove(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

}


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['silence'],
  perms: [
      'MANAGE_MESSAGES'
  ]
};

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name: "mute",
  description: "Mute a user for a specific amount of time",
  usage: "!mute [user] [time]"
};
