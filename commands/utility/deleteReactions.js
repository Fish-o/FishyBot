

const  Guild = require('../../database/schemas/Guild')

const { MessageCollector } = require('discord.js');
const MessageModel = require('../../database/schemas/Message');
let unicodeEmoji_regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;


exports.run = async(client, message, args) => {
    if(args.length !== 1) {
        let msg = await message.channel.send("Incorrect amount of arguments. Must provide 1 message id");
        await msg.delete({ timeout: 3500 }).catch(err => console.log(err));
    }
    // Check if the message exists.
    const { channel, author } = message;
    try {
        let fetchedMessage = channel.messages.cache.get(args[0]) || await channel.messages.fetch(args[0]);
        if(!fetchedMessage) 
            channel.send("Message not found.");
        else {
            // Check if the message exists in the DB.
            let msgModel = await MessageModel.findOne({ messageId: fetchedMessage.id });
            if(msgModel) {
    
                await MessageModel.deleteOne({
                    messageId: fetchedMessage.id
                });
                client.cachedMessageReactions.delete(fetchedMessage.id);
                fetchedMessage.reactions.removeAll()
                message.channel.send('The reaction roles have been removed')
            
            } 
            else {
                message.channel.send(`There is no configuration for that message. Please use ${client.config.prefix}addreactions on a message to set up Role Reactions on that message.`)
            }
        }
    }
    catch(err) {
        //Sentry.captureException(err);
        console.log(err);
    }

}
  
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['delreactions', 'removereactions'],
    perms: [
        'ADMINISTRATOR'
    ]
};
  
const path = require("path");
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"deletereactions",
    description: "Remove all reaction roles from a message",
    usage: "deletereactions (message id)"
};



