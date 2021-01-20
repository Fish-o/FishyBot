

const  User = require('../database/schemas/User')
const Guild = require('../database/schemas/Guild');
//const Ssentry = require("@sentry/node");
////const Ttracing = require("@sentry/tracing");

exports.updatedb = async (query, value, msg = '', channel = null) => {

    try{
        await Guild.updateOne(query, value)
        if(msg != '' && channel){
            channel.send(msg)
        }
    } catch(err){
        //Sentry.captureException(err);
        console.log(err)
        console.log('\nerror in updating db')
    }
    /*let uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) console.log(err);
        const collection = mongoClient.db("botdb").collection("v2");
        collection.updateOne(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            mongoClient.close();
            if(msg != '' && channel){
                channel.send(msg)
            }
        });
    })*/
}




let dbUserCache = {};
let user_refres_cooldown = 15 * 1000;
let user_max_cooldown = 10 * 60 * 1000;

exports.getDbUser = async (user) => {
    return new Promise( async(resolve,reject) => {
        let discordId = user.id;

        if(user){
            if(!dbUserCache[discordId]){
                let newDbUser = await User.findOne({discordId: discordId})
                if(newDbUser){
                    newDbUser.timestamp = Date.now();
                    dbUserCache[discordId] = newDbUser;
                    resolve(newDbUser)
                   
                    return
                } else{
                    let dbUser = {
                        discordId,
                        discordTag:user.tag,
                        avatar:user.avatar,
                        usernames:{},
                        guilds:[]
                    }
                    resolve(dbUser)
                    let dbData = await User.findOneAndUpdate({discordId:user.id}, dbUser, { upsert: true, setDefaultsOnInsert: true, new:true})
                    dbData.timestamp = Date.now();
                    dbUserCache[discordId] = dbData;
                }
            } else{
                if(dbUserCache[discordId].timestamp > Date.now()-user_max_cooldown){
                    let dbUser = {
                        discordId,
                        discordTag:user.tag,
                        avatar:user.avatar
                    }
                    let newDbUser = await User.findOneAndUpdate({discordId:user.id}, dbUser, { upsert: true, setDefaultsOnInsert: true, new:true})
                    newDbUser.timestamp = Date.now();
                    if(newDbUser){
                        dbUserCache[discordId] = newDbUser;
                        resolve(dbUserCache[discordId])
                    } else {
                        resolve(dbUserCache[discordId])
                        delete dbUserCache[discordId];
                    }
                    
                } else if(dbUserCache[discordId].timestamp > Date.now()-user_refres_cooldown){
                    resolve(dbUserCache[discordId])

                    let dbUser = {
                        discordId,
                        discordTag:user.tag,
                        avatar:user.avatar
                    }
                    let newDbUser = await User.findOneAndUpdate({discordId:user.id}, dbUser, { upsert: true, setDefaultsOnInsert: true, new:true})
                    if(newDbUser)
                        dbUserCache[discordId] = newDbUser;
                    else
                        delete dbUserCache[discordId];
                } else{
                    resolve(dbUserCache[discordId])
                }
            }
        } else{
            resolve(undefined)
        }
    })
}







let dbGuildCache = {};
let refres_cooldown = 15 * 1000;
let max_cooldown = 10 * 60 * 1000;

exports.getDbGuild = async (id=undefined, focus="normal") => {
    return new Promise( async(resolve,reject) => {
        let response;
        
        if(id){
            if(!dbGuildCache[id]){
                let new_db_guild = await Guild.findOne({id: id})
                new_db_guild.timestamp = Date.now();
                if(new_db_guild){
                    resolve(new_db_guild)
                    dbGuildCache[id] = new_db_guild;
                }
            }else if(focus == 'normal'){
                if(dbGuildCache[id].timestamp > Date.now()-max_cooldown){
                    let new_db_guild = await Guild.findOne({id: id});
                    new_db_guild.timestamp = Date.now();
                    if(new_db_guild){
                        dbGuildCache[id] = new_db_guild;
                        resolve(dbGuildCache[id])
                    } else {
                        resolve(dbGuildCache[id])
                        delete dbGuildCache[id];
                    }
                    
                } else if(dbGuildCache[id].timestamp > Date.now()-refres_cooldown){
                    resolve(dbGuildCache[id])
                    let new_db_guild = await Guild.findOne({id: id});
                    new_db_guild.timestamp = Date.now();

                    if(new_db_guild)
                        dbGuildCache[id] = new_db_guild;
                    else
                        delete dbGuildCache[id];
                } else{
                    resolve(dbGuildCache[id])
                }
                
            }else if(focus == 'speed'){
                resolve(dbGuildCache[id])
                if(dbGuildCache[id].timestamp < Date.now()-refres_cooldown){
                    let new_db_guild = await Guild.findOne({id: id});
                    new_db_guild.timestamp = Date.now();
                    
                    if(new_db_guild)
                        dbGuildCache[id] = new_db_guild;
                    else
                        delete dbGuildCache[id];
                }else{
                    resolve(dbGuildCache[id])
                }
                
            }else if(focus == 'acc'){
                if(dbGuildCache[id].timestamp < Date.now()-1500){
                    let new_db_guild = await Guild.findOne({id: id});
                    new_db_guild.timestamp = Date.now();

                    if(new_db_guild){
                        dbGuildCache[id] = new_db_guild;
                        resolve(dbGuildCache[id]);
                    }
                    else
                        delete dbGuildCache[id];
                }else{
                    resolve(dbGuildCache[id])
                }
                
            }
        } else{
            if(focus == 'speed'){
                resolve(Object.values(dbGuildCache))
            }
        }
    })
}


/*exports.AddGuildToMember = async (memberID, guildID) =>{
    const DbUser = await User.findOne({discordId: memberID});
    const DbGuild = await Guild.findOne({id:guildID});

    const user_guild_data = DbUser.guilds.get(message.guild.id);
    if(!user_guild_data && DbGuild){
        await User.findOneAndUpdate({discordId: memberID}, {[`guilds.${guildID}`]: {warns:[], usernames:{}}});
    }
}*/

exports.allow_test = async (cmd_name, guild_cache_arg) =>{
    let guild_cache = guild_cache_arg;// || await client.getDbGuild(guild_id, 'speed');
    if(guild_cache.settings[cmd_name] == false){return false};
    return true
}








