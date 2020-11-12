var fs = require('fs');

const  Guild = require('../database/schemas/Guild');

exports.updatedb = async (client, query, value, msg = '', channel = null) => {
    try{
        await Guild.updateOne(query, value)
        if(msg != '' && channel){
            channel.send(msg)
        }
    } catch(err){
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


exports.recache = async function (client, id=''){
    try{

        const all_guilds = await Guild.find({})
        let data = {timestamp:new Date().getTime(),
            data:all_guilds}


        let jsonData = JSON.stringify(data);
        fs.writeFile(__dirname + '/../jsonFiles/cache.json', jsonData, function(err) {
            if (err) {
                console.log(err);
            }
        });

    }catch(err){
        console.log(err)
        console.log('Error in recache, trying again')
        client.recache();
    }
}

let dbGuildCache = {};
let refres_cooldown = 15 * 1000;
let max_cooldown = 10 * 60 * 1000;

exports.getDbGuild = async (id=undefined, focus="normal") => {
    return new Promise( (resolve,reject) => {
        let response;

        
        if(id){
            if(!dbGuildCache[id]){
                let new_db_guild = Guild.findOne({id: id})
                if(new_db_guild){
                    resolve(new_db_guild)
                    dbGuildCache[id] = new_db_guild;
                }
            }else if(focus == 'normal'){
                if(dbGuildCache[id].timestamp > Date.now()-max_cooldown){
                    let new_db_guild = Guild.findOne({id: id});
                    if(new_db_guild){
                        dbGuildCache[id] = new_db_guild;
                        resolve(dbGuildCache[id])
                    } else {
                        resolve(dbGuildCache[id])
                        delete dbGuildCache[id];
                    }
                    
                } else if(dbGuildCache[id].timestamp > Date.now()-refres_cooldown){
                    resolve(dbGuildCache[id])
                    let new_db_guild = Guild.findOne({id: id});
                    if(new_db_guild)
                        dbGuildCache[id] = new_db_guild;
                    else
                        delete dbGuildCache[id];
                }
                
            }else if(focus == 'speed'){
                resolve(dbGuildCache[id])
                if(dbGuildCache[id].timestamp > Date.now()-refres_cooldown){
                    let new_db_guild = Guild.findOne({id: id});
                    if(new_db_guild)
                        dbGuildCache[id] = new_db_guild;
                    else
                        delete dbGuildCache[id];
                }
                
            }else if(focus == 'acc'){
                if(dbGuildCache[id].timestamp > Date.now()-5000){
                    let new_db_guild = Guild.findOne({id: id});
                    
                    if(new_db_guild){
                        dbGuildCache[id] = new_db_guild;
                        resolve(dbGuildCache[id]);
                    }
                    else
                        delete dbGuildCache[id];
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

exports.allow_test = function(client, cmd_name, guild_id){
    let cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
    let cache = JSON.parse(cache_raw);

    
    let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == guild_id)
    if(guild_cache.settings[cmd_name] == false){return false};
    return true
}
