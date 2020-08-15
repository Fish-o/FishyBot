const active = new Map();
const talkedRecently = new Set();
const Discord = require('discord.js');
var fs = require("fs");
const path = require("path")
const MongoClient = require('mongodb').MongoClient;








module.exports = (client, message) => {

    if(message.content.includes("🥔") || message.content.toLowerCase().includes("potato")){
        message.react("🥔")
    } 
    if(message.content.toLowerCase().includes("fish")){
        message.react("🐟")
    }


    if(message.content == 'botshut' && message.author.id == client.master){
        client.sendinfo('Shutting down')
        client.destroy()
    } else if(message.content == 'botsenduptime' && message.author.id == client.master){
        client.sendinfo(`Uptime: ${client.uptime / 1000}`)
    }
    const uri = client.config.dbpath;
    let ops = {
        active: active
      }
      var args;
      var command;
      var cmd;
      
      // Ignore all bots
      if (message.author.bot) return;
      if (message.channel instanceof Discord.DMChannel) return message.reply("This bot does not support DM messages");
      
      
      // Saving the message
      try{
          if (message.author.bot) return;
          var date = new Date();
          var Day = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();
          var Time = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
          fs.appendFile('./logs/'+ Day + '.log', '\n['+Time +']  User: \"' + message.member.user.tag+'\" Content: \"'+ message.content +'\" Raw: '+JSON.stringify(message), function (err) {
          if (err) throw err;
          //console.log('Saved!');
          })  
      }
      
      catch (e){
          console.log("Error saving message")
      }
      

    var cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
    if(!cache_raw){
        client.recache()
    }
    var cache = JSON.parse(cache_raw);

    if(!cache){
        client.recache()
    }
    if(!cache.timestamp){
        client.recache()
    }

    const utc_time = new Date().getTime()
    const recache_time = 60 * 1000







    //cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
    //cache = JSON.parse(cache_raw);
    
    

    /*if(!cache.timestamp){
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
		mongoClient.connect(err => {
			console.log('...conect');
			if (err) throw err;
			const collection = mongoClient.db("botdb").collection("v2");
			collection.find({}).toArray(function(err, result) {
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
                
                var jsonData = JSON.stringify(result);
                var fs = require('fs');
                fs.writeFile(__dirname + '/../jsonFiles/cache.json', jsonData, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
                cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
                cache = JSON.parse(cache_raw);
				//setTimeout(function(){
				//	resolve(result);
				//}, 250);
					
			});
		});

    }*/
    if(cache.timestamp+recache_time <= utc_time || (message.content == 'recache' && message.author.id == '325893549071663104')){
        

        cache.data.forEach(cache_guild => {
            if(cache_guild.member_count_channel){
                try{
                    let guild_count = client.guilds.cache.find(search_guild => search_guild.id == cache_guild.id)
                    if(guild_count){
                        let channel_count = guild_count.channels.cache.find(search_channel => search_channel.id == cache_guild.member_count_channel)
                        if(channel_count){
                            var memberCount = guild_count.members.cache.filter(member => !member.user.bot).size; 
                            channel_count.setName(`Members: ${memberCount}` )
                        }
                    }
                    
                    
                }
                catch(err){
                    console.log(err)
                    message.channel.send('An error has occurred')
                }
            }
        })
        client.recache()
    }
    if(!message.guild){console.log(message)}
    if(!cache.data.filter(db_guild => db_guild.id == message.guild.id)){return console.log('EROROROROROROORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')}
    if(!cache.data.filter(db_guild => db_guild.id == message.guild.id)[0]){
        const guild = message.guild;
        guild.members.fetch().then((member_list) => {
    
            var guildObject = {
                    id : guild.id,
                    users:{},
                    prefix:"!",
                    allow_say:true
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
        
        console.log(message.guild.name)
    
    }
    else{
        const guild_prefix = cache.data.filter(db_guild => db_guild.id == message.guild.id)[0].prefix

        

        /*
        var user_list_promise = new Promise(function(resolve, reject){
            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                console.log('...conect');
                if (err) throw err;
                const collection = mongoClient.db("botdb").collection("v2");
                collection.find({}).toArray(function(err, result) {
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
        });*/
        
        
    
        // Ignore messages not starting with the prefix (in config.json)
        
        if (message.content.indexOf(client.config.prefix) == 0 ){
            var args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
            var command = args.shift().toLowerCase();
        }

        else if (message.content.indexOf(guild_prefix) == 0){   
            var args = message.content.slice(guild_prefix.length).trim().split(/ +/g);
            var command = args.shift().toLowerCase();
        }

        else { return 0;}


        // Our standard argument/command name definition.
        
        
    
        // Grab the command data from the client.commands Enmap
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }
        //const cmd = client.commands.get(command);
    
        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        var succes = true;
        if(!client.bypass || message.author.id !== '325893549071663104'){
            cmd.conf.perms.forEach(permision => {
                try{
                    if(!message.member.hasPermission(permision)){succes = false;}
                }
                catch(err){
                    console.log(err)
                    return message.channel.send("Something went wrong, please contact Fish#2455 ");
                }
            });
        }
        if(!succes) return message.channel.send("Oops looks like you dont have the right permissions :(");



        if (talkedRecently.has(message.author.id)) {
            message.channel.send("So fast! Wait a moment please!");
        } else {
            // Test for perms
            
            // Run the command
            cmd.run(client, message, args, ops);

            // Adds the user to the set so that they can't talk for a minute
            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 1500);
        }
    }
  
//})
};
