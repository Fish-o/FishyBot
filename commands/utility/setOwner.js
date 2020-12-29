const ms = require("ms");
exports.run = async (client, message, args) => {
    if(!message.guild.owner.id == client.user.id){
        message.channel.send('The bot isnt the owner of this server, and cannot transfer it to anyone else')
    }
    let member = message.mentions.members.first() || message.member;
    message.channel.send('This needs over half of the administrators to agrea in the span of 1 hour');

    let admin_members = message.guild.members.cache.filter(guild_member => guild_member.permissions.has('ADMINISTRATOR') && guild_member.id !== member.id);
    if(!admin_members || admin_members.length <= 1){

        return;
    } 
    
    let votemsg = await message.channel.send(`Do administrators agree with ${member} getting ownership of \`${message.guild.name}\`? (required: ${Math.ceil(admin_members.length/2)})`);
    votemsg.react('✔️');
    let collected = await msg.awaitReactions((reaction, emojiuser) => emojiuser.permissions.has('ADMINISTRATOR') && emojiuser.id !== member.id && ['✔️'].includes(reaction.emoji.toString()), {max:admin_members.length/2, time:60*60*1000})
    
    if(collected.size >= Math.ceil(admin_members.length/2)){
        message.guild.setOwner(member);
        message.channel.send('The ownership of this server has been transfered to: '+member)
    }
}


exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['newowner', 'transferownership', 'transferowner'],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"setowner",
    description: "Sync a channels permissions with the parent category+",
    usage: "setowner <member>"
};
