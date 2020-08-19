const Discord = require('discord.js');
const fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
module.exports = (client, member) =>{
	

    const uri = client.config.dbpath;
	let current_member = member

	/*		
	current_member.id
	current_member.tag
	current_member.guild.id
	var userObject = {
		id : current_member.id,
		guild : current_member.guild.id,
		warns : [],
		data:{
			usernames:{}
		}
	}

	
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
	*/

	// Get data base data
	var user_list_promise = new Promise(function(resolve, reject){
		var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("v2");
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
				}, 250);
					
			});
		});
	});

	// Get guilds
	
	user_list_promise.then( async function(value) {
		var guildID = member.guild.id;
		db_data = value;
		if(!db_data[guildID]) {return 0}// message.channel.send('Could not find guild, contact Fish#2455');}
		if(!db_data[guildID].users) {return 0}// message.channel.send('Something went wrong, contact Fish#2455');}


		var guild_user_id_list = await member.guild.members.fetch();
		var db_user_list = db_data[guildID].users;
		var db_user_id_list;

		db_user_list.forEach(db_user => {
			db_user_id_list.push(db_user.id);
		})
		

		var not_in_db = guild_user_id_list.filter(userID => {!db_user_id_list.includes(userID)});
		
		not_in_db.forEach(new_user_id => {
			var userObject = {
				warns:[],
				data:{
					"usernames":{},
					"region":null 
				}
			}
			db_data[guildID].users[new_user_id] = userObject;
		})

		/*const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			if (err) console.log(err);
			const collection = mongoClient.db("botdb").collection("users");
			// perform actions on the collection object
			collection.replaceOne({id:member.guild.id}, db_data, function(err, res) {
				if (err) throw err;
				console.log("1 document replaced");
				mongoClient.close();
			});
		});*/
	});











    
    




















    //const uri = client.config.dbpath
    var guild_data_promise = new Promise(function(resolve, reject){
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoClient.connect(err => {
            console.log('...conect');
            if (err) throw err;
            const collection = mongoClient.db("botdb").collection("v2");
            collection.find({id:member.guild.id}).toArray(function(err, result) {
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
        if(!value.joinMsg){return};

        //const member = member;

        // Send the message to a designated channel on a server:
        const channel = member.guild.channels.cache.find(ch => ch.id === value.joinMsg.channelId);
        
        // Do nothing if the channel wasn't found on this server
        if (!channel) return;

        if(value.joinMsg.dm != '' && value.joinMsg.dm){
            
            member.send(value.joinMsg.dm.replace("{name}", member));
        }
        if(value.joinMsg.message) return channel.send(value.joinMsg.message)
        value.joinMsg.title
        value.joinMsg.desc

        // Send the message, mentioning the member
        
        
        let sicon = member.user.displayAvatarURL();
        let serverembed = new Discord.MessageEmbed();
        serverembed.setColor(value.joinMsg.color);
        serverembed.setThumbnail(sicon);
        serverembed.addField(value.joinMsg.title.b.replace("{name}", member.user.username)  ,value.joinMsg.title.s.replace("{name}", member));
        if(value.joinMsg.desc){
            serverembed.addField(value.joinMsg.desc.b.replace("{name}", member.user.username)   ,value.joinMsg.desc.s.replace("{name}", member));
        }
        try{
            channel.send(serverembed);
        } catch(err){
            console.log(err);
            console.log('Error in join message');
        }
        /*
            .setColor("#ff0000")
            .setThumbnail(sicon)
            .addField("Here comes a new quester!",`A new member has joined to The VR Gang ${member}`)
            .addField("Where should i start ?","Read the 📄-rules, and then try running !friendme in the #🤝-friend-me channel!");



        */
    });
    

































    /*
		
	
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(ch => ch.name === '💬-chit-chat');
	
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;

	// Send the message, mentioning the member
	member.send(`Welcome to the server ${member} please read the rule channel and enjoy your journey to our server!`);
	
	let sicon = member.user.displayAvatarURL();
	let serverembed = new Discord.MessageEmbed()
		.setColor("#ff0000")
		.setThumbnail(sicon)
		.addField("Here comes a new quester!",`A new member has joined to The VR Gang ${member}`)
		.addField("Where should i start ?","Read the 📄-rules, and then try running !friendme in the #🤝-friend-me channel!");

	channel.send(serverembed);*/
}