const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

module.exports = (client, guild) => {
    client.sendinfo('event: guild create')
    console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);

	var guildID = guild.id;
    //var guild = client.guilds.cache.get(guildID);
    
    const uri = client.config.dbpath;


    // Get guilds
	
	/*user_list_promise.then( function(value) {
		old_db_data = value;
		
		client.guilds.cache.forEach(element => {
			function in_guild(member){
				return member.guild == element.id;
			}*/

    //old_db_guild = old_db_data.filter(in_guild);

    var guild_data_promise = new Promise(function(resolve, reject){
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoClient.connect(err => {
            console.log('...conect');
            if (err) throw err;
            const collection = mongoClient.db("botdb").collection("v2");
            collection.find({id:guild.id}).toArray(function(err, result) {
                console.log('...find');
                if (err) {console.error(err); throw err};
                
            
                
                //let new_results = [];
                //for(i = 0; i < result.length; i++){
                //	new_results.push(JSON.stringify({	id: result[i].id,
                //						guild: result[i].guild}));
                //}
                mongoClient.close();
                console.log('...close');
                setTimeout(function(){
                    resolve(result);
                }, 100);
                    
            });
        });
    });



    // Get guilds
    guild_data_promise.then( async function(value) {
        value = value[0]
        if(!value){


            guild.members.fetch().then((member_list) => {
            
                var guildObject = {
                        id : guild.id,
                        users:{},
                        prefix:"!",
                        settings:{
                            "dadjokes":false
                        }
                }

                member_list.forEach(guild_member => {
                    var userObject = {
                    
                        warns:[],
                        data:{
                            "usernames":{},
                            "region":null 
                        }
                    
                    }
                    userId = guild_member.id;
                    guildObject.users[userId] = userObject;

                })
                


                // Push new Guild object with users to db
                const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                mongoClient.connect(err => {
                    if (err) console.log(err);
                    const collection = mongoClient.db("botdb").collection("v2");
                    // perform actions on the collection object
                    collection.insertOne(guildObject, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        mongoClient.close();
                        client.recache()
                    });
                    
                });


            })
        }        
    });
};