const MessageModel = require('../database/schemas/Message');
exports.event = async (client, reaction, user) => {
    let removeMemberRole = async (emojiRoleMappings) => {
        if(reaction.emoji.id){
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
                let roleId = emojiRoleMappings[reaction.emoji.id];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.remove(role);
                }
            }
        } else{
            reaction = await reaction.fetch();
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.name)) {
                let roleId = emojiRoleMappings[reaction.emoji.name];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.remove(role);
                }
            }
        }
    }
    if(reaction.message.partial || !client.cachedMessageReactions.has(reaction.message.id)) {
        await reaction.message.fetch();
        let { id } = reaction.message;
        try {
            let msgDocument = await MessageModel.findOne({ messageId: id });
            if(msgDocument) {
                client.cachedMessageReactions.set(id, msgDocument.emojiRoleMappings);
                let { emojiRoleMappings } = msgDocument;
                removeMemberRole(emojiRoleMappings);
            }
        }
        catch(err) {
            console.log(err);
        }
    }
    else {
        let emojiRoleMappings = client.cachedMessageReactions.get(reaction.message.id);
        removeMemberRole(emojiRoleMappings);
    }
};


exports.conf = {
    event: "messageReactionRemove"
};