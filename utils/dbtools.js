var MongoClient = require('mongodb').MongoClient;
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
    let uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.find({}).toArray(function(err, result) {
            if (err) {console.error(err); throw err};
            mongoClient.close();
            var data = {timestamp:new Date().getTime(),
                data:result}

            var jsonData = JSON.stringify(data);
            var fs = require('fs');

            fs.writeFile(__dirname + '/../jsonFiles/cache.json', jsonData, function(err) {
                if (err) {
                    console.log(err);
                }
            }); 
        });
    });
}



exports.dbgetuser = function (client, guildid, userid){
    let uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.find({id: guildid}).toArray(function(err, result) {

            console.log(result);
            let guild_data = result[0];
            if (err) {console.error(err); throw err};
            mongoClient.close();
            const db_user = guild_data.users[userid];
            if(db_user){
                return db_user;
            }else{
                return guild_data.users[Math.floor(Math.random()*guild_data.users.length)];
            }
        });
    });
}


exports.allow_test = function(client, cmd_name, guild_id){
    let cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
    let cache = JSON.parse(cache_raw);

    let locate_string = cmd_name
    
    let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == guild_id)
    if(guild_cache.settings[cmd_name] == false){return false}
    client.recache(client, )
    return true
}
