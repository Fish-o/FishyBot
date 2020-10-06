var MongoClient = require('mongodb').MongoClient;
var Canvas = require('canvas');
var fs = require('fs');

const  User = require('../database/schemas/User');
const  Guild = require('../database/schemas/Guild');

exports.updatedb = function(client, query, value, msg = '', channel = null) {
    let uri = client.config.dbpath;
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
    })
}

exports.recache = async function (client){

    try{

        const all_guilds = Guild.find({})
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



exports.dbgetuser = function (client, guildid, userid){
    return new Promise((resolve, reject) => {
        
        let uri = client.config.dbpath;
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoClient.connect(err => {
            if (err) throw err;
            const collection = mongoClient.db("botdb").collection("v2");
            collection.find({id: guildid}).toArray(function(err, result) {
                let guild_data = result[0];
                if (err) {console.error(err); throw err};
                mongoClient.close();
                const db_user = guild_data.users[userid];
                if(db_user){
                    resolve(db_user);
                }else{
                    resolve(guild_data.user[Object.keys(guild_data.users)[Math.floor(Math.random()*guild_data.users.length)]]);
                }
            });
        });
    });
        
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
