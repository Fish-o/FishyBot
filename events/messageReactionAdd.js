const MessageModel = require('../database/schemas/Message');
const  CommandModel = require('../database/schemas/Command')
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
                addMemberRole(emojiRoleMappings);
            }
        }
        catch(err) {
            //Sentry.captureException(err);
            console.log(err);
        }
    }
    else {
        let emojiRoleMappings = client.cachedMessageReactions.get(reaction.message.id);
        addMemberRole(emojiRoleMappings);
    }





    if(reaction.message.partial){
        await reaction.message.fetch();
    }
    let message = reaction.message;
    let MsgId = message.id;
    
    if(['❌', '❎', '✖️'].includes(reaction.emoji.name)){
        if(message.member.hasPermission("MANAGE_MESSAGES")){
            await reaction.message.delete()
            await CommandModel.update(
                {channelId: message.channel.id, senderId:user.id, responses:MsgId},
                { $pull: { 'responses': MsgId } }
            )
        }else if(message.author.id == client.user.id){
            let command_obj = await CommandModel.find({channelId: message.channel.id, senderId:user.id, responses:message.id})
            if(command_obj && command_obj[0]){
                await reaction.message.delete()
                await CommandModel.updateOne(
                    {channelId: message.channel.id, senderId:user.id, responses:MsgId},
                    { $pull: { 'responses': MsgId } }
                );
            }
        }else{
            reaction.remove()
        }
    }
    


};


exports.conf = {
    event: "messageReactionAdd"
};