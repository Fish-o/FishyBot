const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

exports.run = (client, message, args) => {
    if(message.author.id !== '325893549071663104'){
        return message.channel.send("You don't have the permissions to use this command!");
    }

    
	
	var guildID = message.guild.id;
	//var guild = client.guilds.cache.get(guildID);

	const uri = client.config.dbpath


    /*db_user_id_list.forEach(usr_id =>{
        let usr = db_user_list[usr_id]
        console.log(usr.data.usernames)
        if(usr.data.usernames === null){not_in_db.push(usr_id)}

    })*/



    var user_list_promise = new Promise(function(resolve, reject){
		var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("v2");
			collection.find().toArray(function(err, result) {
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
				}, 500);
					
			});
		});
	});

    user_list_promise.then(value => {
        db_data = value;
        
        db_data.forEach(db_guild => {

            /*Object.keys(db_guild.users).forEach(userId =>{
                if(db_guild.users[userId].data === undefined){
                    db_guild.users[userId].data = {
                        usernames:{},
                        region:null
                    }
                }else if(db_guild.users[userId].data.usernames === null){
                    db_guild.users[userId].data.usernames = {};
                }
            })*/
            if(db_guild.settings == undefined){
                db_guild.settings == {}
            }
            //db_guild.settings.say = db_guild.allow_say
            

        
        
            // Push new Guild object with users to db
            const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("v2");
                // perform actions on the collection object
                collection.replaceOne({id:db_guild.id}, db_guild, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    mongoClient.close();
                });
                
            });
        })

    })






	
	
















	// Get guilds
	/*
	user_list_promise.then( function(value) {
		old_db_data = value;
		
		client.guilds.cache.forEach(element => {
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
					usernames = guild_member.data.usernames;
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


		});
	});
	
	







*/

	/*

    var user_list_promise = new Promise(function(resolve, reject){
		var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("users");
			collection.find({}).toArray(function(err, result) {
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
				}, 500);
					
			});
		});
	});




	
	user_list_promise.then( function(value) {
        db_list = value;
        console.log(db_list);

		guild.members.fetch().then(members => {
			members.forEach(member_raw => {
                let current_member = member_raw.user
				let db_current_member = db_list.find((user) => user.id == current_member.id && user.guild == message.guild.id);
                if(!db_current_member){return console.log(db_current_member)}
                
                var userObject = {
					id : current_member.id,
					guild : message.guild.id,
					warns : [],
					data:{
						usernames:{}
                    }
                }
                if(db_current_member.usernames){
                    userObject.data.usernames = db_current_member.usernames
                }
				
				const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                mongoClient.connect(err => {
                    if (err) console.log(err);
                    const collection = mongoClient.db("botdb").collection("users");
                    // perform actions on the collection object
                    collection.replaceOne({id:current_member.id, guild:message.guild.id}, userObject, function(err, res) {
                        if (err) throw err;
                        console.log("1 document replaced");
                        mongoClient.close();
                    });
                    
                });
				

            });
        });

		
        
    });*/
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        ''
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"dbupdate",
    description: "This is not supposed to be used.",
    usage: ""
};