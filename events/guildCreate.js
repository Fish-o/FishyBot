const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

module.exports = (client, guild) => {
    client.sendinfo('event: guild create')
    console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);

    let rawdata = fs.readFileSync(__dirname + '/../jsonFiles/config.json');
	let config = JSON.parse(rawdata);
	
	var guildID = guild.id;
    //var guild = client.guilds.cache.get(guildID);
    
    const uri = config['dbpath'];


    // Get guilds
	
	/*user_list_promise.then( function(value) {
		old_db_data = value;
		
		client.guilds.cache.forEach(element => {
			function in_guild(member){
				return member.guild == element.id;
			}*/

    //old_db_guild = old_db_data.filter(in_guild);
    guild.members.fetch().then((member_list) => {
    
        var guildObject = {
                id : guild.id,
                users:{},
                prefix:"!",
                settings:{}
        }

        member_list.forEach(guild_member => {
            
            console.log('\n#####################################\n')
            console.log()
            
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
    


    
    

};