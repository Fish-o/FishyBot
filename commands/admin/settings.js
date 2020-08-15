var fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
exports.run = (client, message, args) => {
    const uri = client.config.dbpath;
    if(!args[0]){return}

    var command = args[0].toLowerCase();
    var action = args[1];
    var guildID = message.guild.id;
    
    
    if(command == 'say'){

        //if(action == 'toggle'){

        //}
        if(action == 'off' || !action){
            var guildQuery = {id: guildID};
            const locate_string = "allow_say"

            var newnewvalues = { $set: {[locate_string]:false}}


            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("v2");
                collection.updateOne(guildQuery, newnewvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    mongoClient.close();
                    message.channel.send("Disabled the say command")
                    client.recache()
                });
            });
            
        }else if(action == 'on'){
            var guildQuery = {id: guildID};
            const locate_string = "allow_say"

            var newnewvalues = { $set: {[locate_string]:true}}


            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("v2");
                collection.updateOne(guildQuery, newnewvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    mongoClient.close();
                    message.channel.send("Enabled the say command")
                    client.recache()
                });
            });
            
        }


    }

    
    console.log('setting done')
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['preferences','setting','change'],
    perms: [
        'MANAGE_ROLES_OR_PERMISSIONS'
    ]
};
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"settings",
    description: "w.i.p.",
    usage: "!settings [text]"
};
