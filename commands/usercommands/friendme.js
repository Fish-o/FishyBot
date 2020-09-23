const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
exports.run = (client, message, args) => {
    //return message.channel.send('This wont work for now, as the database is being worked on, sorry for the inconvenience.')
    let rawdata = fs.readFileSync(__dirname + '/../../jsonFiles/emojis.json');
    const emoji_data = JSON.parse(rawdata);
    

    var member = message.author

    if( message.mentions.users.first() && message.member.hasPermission("MANAGE_MESSAGES")){
        member = message.mentions.users.first()
    }
    
    /*const platforms = 
    {
        emoji_oculus : client.emojis.cache.get(emoji_data.oculus).toString(),
        emoji_nintendo :client.emojis.cache.get(emoji_data.nintendo).toString(),
        emoji_steam :   client.emojis.cache.get(emoji_data.steam).toString(),
        emoji_xbox :    client.emojis.cache.get(emoji_data.xbox).toString()
    };*/

    message.channel.send('Click on the emoji of the platform to add your name to.').then(sent => {
        for(let platform in emoji_data.logos){
            sent.react(emoji_data.logos[platform]);
        };

        const filter = (reaction, user) => user.id == message.author.id && Object.values(emoji_data['logos']).includes(reaction.emoji.id);
        sent.awaitReactions(filter, {max:1, time:30000}).then(collected =>{
            if(collected.first()){
                var emojiID = collected.first().emoji.id

                var key = Object.keys(emoji_data['logos']).find(key => emoji_data['logos'][key] == emojiID)
                message.reply('Enter your **'+key+'** username. Type `CANCEL` in all caps to stop the operation.')
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(collected => {
                    if(collected.first().content){
                        if(collected.first().content == 'CANCEL'){
                            message.reply('Operation cancled')
                        }
                        else{
                            const username = collected.first().content;
                            const platform = key;

                            const uri = client.config.dbpath;
                            // ############### Promise
                            var guild_promise = new Promise(function(resolve, reject){
                                var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                                mongoClient.connect(err => {
                                    if (err) throw err;
                                    const collection = mongoClient.db("botdb").collection("v2");
                                    collection.findOne({id: message.guild.id}, function(err, result){
                                        if (err) {console.error(err); throw err};
                                        mongoClient.close();
                                        setTimeout(function(){
                                            resolve(result);
                                        }, 100);
                                            
                                    });
                                });
                            });

                            // ############### Update
                            guild_promise.then(function(value) {
                                if(!value){message.channel.send('Could not find user, did you run !dbadd?')}
                                else{
                                    const userID = member.id;
                                    platform
                                    username

                                    let db_guild_data = value;
                                    var db_user_data = db_guild_data.users[userID];
                                    

                                    var newquery = {id: message.guild.id};
                                    const locate_string = "users."+userID+".data.usernames."+platform  
                                    var newnewvalues = { $set: {[locate_string]:username}}

                                    client.updatedb(client, newquery, newnewvalues, 'Changed **'+platform+'** username to `'+username+'`', message.channel)

                                    /*
                                    const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                                    mongoClient.connect(err => {
                                        if (err) console.log(err);
                                        const collection = mongoClient.db("botdb").collection("v2");
                                        collection.updateOne(newquery, newnewvalues, function(err, res) {
                                            if (err) throw err;
                                            console.log("1 document updated");
                                            mongoClient.close();
                                            message.channel.send('Changed **'+platform+'** username to `'+username+'`')
                                        });
                                    });*/
                                
                                }
                            });

                        }

                    }
                    else{
                        message.reply('Timed-out')
                    }

                });


            }
            else{
                message.channel.send('Timed-out')
            }   
        }).catch(collected =>{
            message.channel.send('catched')
        });
    
    });
    


    //message.reply()



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
    name:"friendme",
    description: "Saves your usernames, so other people can see it with !userinfo",
    usage: "!friendme"
};