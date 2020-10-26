

const  Guild = require('../../database/schemas/Guild')

const { MessageCollector } = require('discord.js');
const MessageModel = require('../../database/schemas/Message');
let unicodeEmoji_regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;


exports.run = async(client, message, args) => {
    if(args.length !== 1) {
        let msg = await message.channel.send("Incorrect amount of arguments. Must only provide 1 message id");
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
            let msgModel = await MessageModel.findOne({ messageId: args[0] });
            if(msgModel) {
                client.emit('msgDocFetched', msgModel);
                // Prompt the user for configurations.
                let filter = m => m.author.id === author.id && (m.content.toLowerCase() === 'add' || m.content.toLowerCase() === 'remove' || m.content.toLowerCase() === 'delete');
                let tempMsg = channel.send("Do you want to add a emoji role pair or want to remove the configuration? Type add or remove");
                try {
                    let awaitMsgOps = { max: 1, time: 4000, errors: ['time'] };
                    let choice = (await channel.awaitMessages(filter, awaitMsgOps)).first();
                    if(choice.content === "add") {
                        let addMsgPrompt = await channel.send("Please provide all of the emoji names with the role name, one by one, separated with a comma.\ne.g: `🐟, admin`, where the emoji comes first, role name comes second.\nType `done` if you are done");
                        let collectorResult = await handleCollector(fetchedMessage, author, channel, msgModel, args[0]);
                        MessageModel.findOneAndUpdate ({messageId: fetchedMessage.id},{ emojiRoleMappings: emojiRoleMappings})
                            .catch(err => console.log(err));
                        message.channel.send('The reactions have been added')
                        
                    } 
                    else if(choice.content === "remove" || choice.content === "delete") {
                        MessageModel.findOneAndDelete ({
                            messageId: fetchedMessage.id
                        });
                        message.channel.send('The reaction roles have been removed')
                    } else{
                        channel.send('Option not found.')
                    }
                }
                catch(err) {
                    console.log(err);
                }
            } 
            else {
                message.channel.send(`There is no configuration for that message. Please use ${client.config.prefix}addreactions on a message to set up Role Reactions on that message.`)
            }
        }
    }
    catch(err) {
        console.log(err);
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
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"editreactions",
    description: "Edits the role reaction configuration",
    usage: "f!editreactions (message id)"
};



function handleCollector(fetchedMessage, author, channel, msgModel, messageId) {
    return new Promise((resolve, reject) => {
        let collectorFilter = (m) => m.author.id === author.id;
        let collector = new MessageCollector(channel, collectorFilter);
        let emojiRoleMappings = new Map(Object.entries(msgModel.emojiRoleMappings));
        collector.on('collect', msg => {
            if(msg.content.toLowerCase() === 'done') {
                collector.stop();
                resolve();
            }
            else {
                let { cache } = msg.guild.emojis;
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
            }
        });
        collector.on('end', () => {
            console.log("Done...");
            resolve(emojiRoleMappings);
        });
    });
}