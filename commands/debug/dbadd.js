const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const https = require('https');

exports.run = (client, message, args) => {
	if(message.author.id !== '325893549071663104'){
        return message.channel.send("You don't have the permissions to use this command!");
	}

	let rawdata = fs.readFileSync(__dirname + '/../../jsonFiles/config.json');
	let config = JSON.parse(rawdata);
	
	var guildID = message.guild.id;
	var guild = client.guilds.cache.get(guildID);

	const uri = config['dbpath'];
	









	// Get data base data
	var user_list_promise = new Promise(function(resolve, reject){
		var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("v2");
			collection.find({id:guildID}).toArray(function(err, result) {
				console.log('...find');
				if (err) {console.error(err); throw err};
				console.log(result);
			
				
				//let new_results = [];
				//for(i = 0; i < result.length; i++){
				//	new_results.push(JSON.stringify({	id: result[i].id,
				//						guild: result[i].guild}));
				//}
				mongoClient.close();
				console.log('...close');
				setTimeout(function(){
					resolve(result);
				}, 250);
					
			});
		});
	});


	// Get guilds
	
	user_list_promise.then( async function(value) {
        let db_data = value[0];
        
		/*if(!("users" in db_data)) {

            return message.channel.send('shit')
			console.log('ifdone')
			console.log('fetchmember')
			var guildObject = {
					id : message.guild.id,
					users:{},
					prefix:"!",
					allow_say:true
			}

			const guild = client.guilds.cache.get(guildID); 

			// Iterate through the collection of GuildMembers from the Guild getting the username property of each member 
			guild.members.cache.forEach(guild_member => {
                    let userId = guild_member.id;
                    
                    if(!db_data.users[userId])
					
					console.log('\n#####################################\n')
					console.log()
					
					var userObject = {
					
						warns:[],
						data:{
							"usernames":{},
							"region":null 
						}
					
					}
					
					//guildObject.users[userId] = userObject;
		
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
					});
					
				});
		
		
			
		}
		else */if(!db_data) {return message.channel.send('Could not find guild, contact Fish#2455');}
		else if(!db_data.users) {return message.channel.send('Something went wrong, contact Fish#2455');}
        else {
            let guild_user_list= await message.guild.members.fetch();
            let guild_user_id_list = [];
            let db_user_list = db_data.users;
            let db_user_id_list = [];


            Object.keys(db_user_list).forEach(key => {
                db_user_id_list.push(key);
            })

            let not_in_db = [];
            db_user_id_list.forEach(usr_id =>{
                let usr = db_user_list[usr_id]
                console.log(usr.data.usernames)
                if(usr.data.usernames === null){not_in_db.push(usr_id)}

            })
           
            
            guild_user_list.forEach(guild_user =>{
                guild_user_id_list.push(guild_user.id)
                if(!db_user_id_list.includes(guild_user.id)){
                    not_in_db.push(guild_user.id)
                }
            })

            
            not_in_db = [...new Set(not_in_db)];
            
            
            //console.log(guild_user_id_list);
            //console.log(db_user_id_list);
            console.log(not_in_db);
            //var not_in_db = guild_user_id_list.filter(userID => {!db_user_id_list.includes(userID)});
            
            let new_users = db_user_list;

            not_in_db.forEach(new_user_id => {
                var userObject = {
                    warns:[],
                    data:{
                        usernames:{},
                        region:null 
                    }
                }
                new_users[new_user_id] = userObject;
            })

            const locate = "users"
            let value = { $set: {[locate]: new_users}};

            client.updatedb(client.config.dbpath, {id:message.guild.id}, value, `Fixxed \`${not_in_db.length}\` users`, message.channel)



            /*const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("users");
                // perform actions on the collection object
                collection.replaceOne({id:message.guild.id}, db_data, function(err, res) {
                    if (err) throw err;
                    console.log("1 document replaced");
                    mongoClient.close();
                });
                
            });*/

            /*client.guilds.cache.forEach(element => {
                function in_guild(member){
                    return member.guild == element.id;
                }

                old_db_guild = old_db_data.filter(in_guild);

                var guildObject = {
                        id : element.id,
                        users:{},
                        prefix:"!",
                        allow_say:true
                }

                old_db_guild.forEach(guild_member => {
                    var usernames = null;
                    console.log('\n#####################################\n')
                    console.log()
                    if(guild_member.data){
                        usernames = guild_member.data.usernames
                    }
                    var userObject = {
                    
                        warns:guild_member.warns,
                        data:{
                            "usernames":usernames,
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
                    });
                    
                });


            });*/
        
        }

    });
	
	

























	/*var guild_list_promise = new Promise(function(resolve, reject){
		var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("v2");
			collection.find({}).toArray(function(err, result) {
				console.log('...find');
				if (err) {console.error(err); throw err};
				mongoClient.close();
				console.log('...close');
				setTimeout(function(){
					resolve(new_results);
				}, 500);
					
			});
		});
	});




	let user_list = 'asdfasdf';
	guild_list_promise.then( function(value) {
		
		console.log(user_list);
		user_list = value;
		console.log(user_list);

		guild.members.fetch().then(members => {
			members.forEach(member_raw => {
				
				
				let current_member = member_raw.user

				
				current_member.id
				current_member.tag
				message.guild.id
				var userObject = {
					id : current_member.id,
					guild : message.guild.id,
					warns : [],
					data:{
						usernames:{}
					}
				}

				if (!user_list.includes(JSON.stringify({id : current_member.id, guild : message.guild.id}))) {
					const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
					mongoClient.connect(err => {
						if (err) console.log(err);
						const collection = mongoClient.db("botdb").collection("users");
						// perform actions on the collection object
						collection.insertOne(userObject, function(err, res) {
							if (err) throw err;
							console.log("1 document inserted");
							mongoClient.close();
						});
						
					});
				}

			});
		});
		message.channel.send('Prommise finished');

	});*/
	message.channel.send('Command finished');
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'ADMINISTRATOR'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"dbadd",
    description: "Add users to the database, if something went wrong.",
    usage: "!dbadd"
};
