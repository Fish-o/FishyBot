
var fs = require("fs");
const MongoClient = require('mongodb').MongoClient;

exports.run = (client, message, args) =>{
    const uri = client.config.dbpath;
    // get the delete count, as an actual number.
    if(!args[0]){return message.channel.send("Enter a prefix")}
    
    

    var newquery = {id: message.guild.id};
    const locate_string = "prefix" 
    var newnewvalues = { $set: {[locate_string]:args.join()}}


    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) console.log(err);
        const collection = mongoClient.db("botdb").collection("v2");
        collection.updateOne(newquery, newnewvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            mongoClient.close();
            message.channel.send('Changed **prefix** to `'+args.join()+'`')
        });
    });


    client.recache()

      
}
  
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['changeprefix','change_prefix'],
    perms: [
        'ADMINISTRATOR'
    ]
};
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"prefix",
    description: "Change the prefix",
    usage: "!prefix [new prefix]"
};