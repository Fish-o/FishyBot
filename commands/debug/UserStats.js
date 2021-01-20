let cache = {};
const  CommandModel = require('../../database/schemas/Command');
exports.run = async (client, message, args) => {
    let userId = message.author.id;
    let channel = message.channel.id;
    
    const updateTime = 120*1000
    if(!args[0]){
        let userCache = cache[userId];
        if(userCache){
            if(userCache.timeStamp <= Date.now() - updateTime){
                let update = await CommandModel.find({senderId:userId, Timestamp: {$gte: userCache.timeStamp}});
                cache[userId].data = cache[userId].data.concat(update);
                cache[userId].timeStamp = Date.now();
                userCache = cache[userId];
            }
            let MessageString = '';
            let commandLOGS = {
            };
            let lengths = {};
            userCache.data.forEach(commandLog => {
                /*if(commandLOGS[commandLog.command]){
                    commandLOGS[commandLog.command].push(commandLog);
                } else{
                    commandLOGS[commandLog.command] = [commandLog];
                }*/
                if(lengths[commandLog.command]){
                    lengths[commandLog.command] += 1
                }else{
                    lengths[commandLog.command] = 1
                }
            });

            Object.keys(lengths).forEach(chatName =>{
                MessageString += `${lengths[chatName]} => ${chatName}\n`
            })
            message.channel.send(MessageString)

        }else{
            let update = await CommandModel.find({senderId:userId});
            cache[userId] = {}
            cache[userId].data = update;
            cache[userId].timeStamp = Date.now();
            userCache = cache[userId];

            let MessageString = '';
            let lengths = {};
            userCache.data.forEach(commandLog => {
                /*if(commandLOGS[commandLog.command]){
                    commandLOGS[commandLog.command].push(commandLog);
                } else{
                    commandLOGS[commandLog.command] = [commandLog];
                }*/
                if(lengths[commandLog.command]){
                    lengths[commandLog.command] += 1
                }else{
                    lengths[commandLog.command] = 1
                }
                
            });
            Object.keys(lengths).forEach(chatName =>{
                MessageString += `${lengths[chatName]} => ${chatName}\n`
            })
            message.channel.send(MessageString)
        }
    }
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"userstats",
    description: "blank",
    usage: "blank"
};
