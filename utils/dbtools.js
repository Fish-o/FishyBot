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



exports.dbgetuser = function (client, userid, guildid){
    let uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.find({id: guildid}).toArray(function(err, result) {
            if (err) {console.error(err); throw err};
            mongoClient.close();
            const db_user = result.users.find(user => {user.id = userid});
            if(db_user){
                return db_user;
            }else{
                return result.users[Math.floor(Math.random()*result.users.length)];
            }
        });
    });
}