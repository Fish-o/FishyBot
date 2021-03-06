exports.run = async (client, message, args) =>{
    let msg = await message.channel.send(`This channels messages will **all be deleted**, are you sure you want to continue`)
    msg.react('✔️');
    msg.react('❌');
    let collected = await msg.awaitReactions((reaction, emojiuser) => emojiuser.id == message.author.id && ['✔️', '❌'].includes(reaction.emoji.toString()), {max:1, time:30000})
     
    if(collected.first()){
            var emoji = collected.first().emoji.toString();

            if(emoji == '✔️'){
                // DELETE IT ALLLLLLLLLLLLL
                let old_channel = message.channel;
                let new_channel = await old_channel.clone();
                new_channel.permissionOverwrites = old_channel.permissionOverwrites
                old_channel.delete()
                let msg2 = await new_channel.send('Cleared the chat!')
                msg2.delete({ timeout: 7500 })
                return;

            } else if (emoji == '❌'){
                return [message.channel.send('Stopped'), msg]
            } else {
                return [message.channel.send('Aborted'), msg]
            }
    } else {
        return [message.channel.send('Stopped'), msg]
    }
  
    
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['clearchat'],
    perms: [
        'MANAGE_MESSAGES'
    ]
};

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name: "clear",
    description: "Clears the entire chat",
    usage: "clear"
};


