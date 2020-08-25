
module.exports = (client) => {
    //var guildID = message.guild.id;
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
            db_guild.settings = {}
            db_guild.settings.say = db_guild.allow_say
            //delete db_guild.allow_say 

        
        
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

    client.recache()
    client.sendinfo('Bot gone online')
	console.log('I am ready to serve you!');
	client.user.setStatus('online');
	//client.user.setActivity('type vr!help');
};