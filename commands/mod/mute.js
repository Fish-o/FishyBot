const ms = require("ms");
//const Ssentry = require("@sentry/node");
const Ttracing = require("@sentry/tracing");

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


exports.run = async(client, message, args) => {
    let tomute =
    message.mentions.members.first() ||
    message.guild.members.cache.get(args[0]) ||
    match(args.join(" ").toLowerCase(), message.guild);

  //!tempmute @user 1s/m/h/d

  if(!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
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
        //Sentry.captureException(e);
      console.log(e.stack);
    }
  }
  //end of create role
    if(!args[1]){
        try{
            await tomute.roles.add(muterole.id);
            message.reply(`${tomute} has been muted for indefinetly`);
        }catch(err){
            return message.channel.send('Couldn\'t mute because: '+err)   
        }
    } else{
        let lenght = ms(args[1]+ " "+ args[2]);
        if(lenght){
            args.shift();
            args.shift();
        } else{
            lenght = ms(args[1]);
            if(lenght){
                args.shift();
            } else{
            return message.channel.send('You have to set a length of time to mute for!')
            }
        }
        
        

        if(lenght > 31*24*60*60*1000)
            return message.channel.send(`The time given (${ms(lenght)}) exceeded the limit of 31 days`);

        
    let mutetime = lenght;
    if(!mutetime) return message.reply("You didn't specify a time!");
    try{
        await tomute.roles.add(muterole.id);
        message.reply(`${tomute} has been muted for ${ms(mutetime)}`);
        setTimeout(function(){
            tomute.roles.remove(muterole.id);
            message.channel.send(`${tomute} has been unmuted!`);
        }, mutetime);
    }catch(err){
        return message.channel.send('Couldn\'t mute because: '+err)   
    }
    
}
}

exports.conf = {
  enabled: true,
  guildOnly: true,
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
  usage: "mute [user] [time]"
};
