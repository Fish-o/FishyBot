const MessageModel = require('../database/schemas/Message');
exports.event = async (client, reaction, user) => {
    let addMemberRole = async (emojiRoleMappings) => {
        if(reaction.emoji.id){
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.id)) {
                let roleId = emojiRoleMappings[reaction.emoji.id];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.add(role);
                }
            } 
        } else{
            console.log('UNicode emoJI')
            reaction = await reaction.fetch();
            if(emojiRoleMappings.hasOwnProperty(reaction.emoji.name)) {
                let roleId = emojiRoleMappings[reaction.emoji.name];
                let role = reaction.message.guild.roles.cache.get(roleId);
                let member = reaction.message.guild.members.cache.get(user.id);
                if(role && member) {
                    member.roles.add(role);
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
                console.log(emojiRoleMappings)
                addMemberRole(emojiRoleMappings);
            }
        }
        catch(err) {
            Sentry.captureException(err);
            console.log(err);
        }
    }
    else {
        console.log('Should add da emoji')
        let emojiRoleMappings = client.cachedMessageReactions.get(reaction.message.id);
        addMemberRole(emojiRoleMappings);
    }
};


exports.conf = {
    event: "messageReactionAdd"
};