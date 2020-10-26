
var fs = require("fs");
const  Guild = require('../../database/schemas/Guild')

const { MessageCollector } = require('discord.js');
const MessageModel = require('../../database/schemas/Message');

let msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;

let unicodeEmoji_regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

exports.run = async (client, message, args) =>{
    
    if(args.length !== 1) {
        let msg = await message.channel.send("Incorrect amount of arguments. Must only provide 1 message id");
        await msg.delete({ timeout: 3500 }).catch(err => console.log(err));
    }
    else {
        try {
            let fetchedMessage = await message.channel.messages.fetch(args[0]);
            if(fetchedMessage) {
                await message.channel.send("Please provide all of the emoji names with the role name, one by one, separated with a comma.\ne.g: `🐟, admin`, where the emoji comes first, role name comes second.\nType `done` if you are done");
                let collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
                let emojiRoleMappings = new Map();
                collector.on('collect', msg => {
                    let { cache } = msg.guild.emojis;
                    if(msg.content.toLowerCase() === 'done') {
                        collector.stop('done command was issued.');
                        return;
                    }
                    let [ emojiText, roleName ] = msg.content.split(/,\s+/);
                    if(!emojiText && !roleName) return;
                    let custom_regex = /<:[a-zA-Z0-9]+:(\d+)>/
                    let emoji;
                    if(custom_regex.test(emojiText)){
                        console.log('Custom emoji')
                        emoji = cache.find(emoji => emoji.id.toLowerCase() === custom_regex.exec(emojiText)[1]);
                    }
                    let unicodeEmoji;
                    if(!emoji) {
                        unicodeEmoji = unicodeEmoji_regex.exec(emojiText);
                        if(!unicodeEmoji){
                            msg.channel.send("Emoji does not exist. Try again.")
                                .then(msg => msg.delete({ timeout: 2000 }))
                                .catch(err => console.log(err));
                            return;
                        }
                    }
                    if(!emoji && !unicodeEmoji) {
                        msg.channel.send("Emoji does not exist. Try again.")
                            .then(msg => msg.delete({ timeout: 2000 }))
                            .catch(err => console.log(err));
                        return;
                    }
                    let role = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
                    if(!role) {
                        msg.channel.send("Role does not exist. Try again.")
                            .then(msg => msg.delete({ timeout: 2000 }))
                            .catch(err => console.log(err));
                        return;
                    }
                    
                    
                    if(emoji){
                        fetchedMessage.react(emoji)
                            .catch(err => console.log(err));
                        emojiRoleMappings.set(emoji.id, role.id);
                    }else if(unicodeEmoji[0]){
                        fetchedMessage.react(unicodeEmoji[0])
                            .catch(err => console.log(err));
                        emojiRoleMappings.set(unicodeEmoji[0], role.id)
                    } else{
                        msg.channel.send("Emoji does not exist. Try again.")
                            .then(msg => msg.delete({ timeout: 2000 }))
                            .catch(err => console.log(err));
                        return;
                    }
                });
                collector.on('end', async (collected, reason) => {
                    let findMsgDocument = await MessageModel
                        .findOne({ messageId: fetchedMessage.id })
                        .catch(err => console.log(err));
                    if(findMsgDocument) {
                        console.log("The message exists.. Don't save...");
                        message.channel.send("A role reaction set up exists for this message already...");
                    }
                    else {
                        let dbMsgModel = new MessageModel({
                            messageId: fetchedMessage.id,
                            emojiRoleMappings: emojiRoleMappings
                        });
                        dbMsgModel.save()
                            .then(m => console.log(m))
                            .catch(err => console.log(err));
                    }
                });
            }
        }
        catch(err) {
            console.log(err);
            let msg = await message.channel.send("Invalid id. Message was not found.");
            await msg.delete({ timeout: 3500 }).catch(err => console.log(err));
        }
    }

      
}
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'ADMINISTRATOR'
    ]
};
  
const path = require("path");
const { length } = require("ffmpeg-static");
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"addreactions",
    description: "Enables a message to listen to reactions to give roles.",
    usage: "f!addreactions (message id)"
};