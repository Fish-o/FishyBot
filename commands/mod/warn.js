//const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;


exports.run = (client, message, args) => {
    function getUserFromMention(mention) {
        if (!mention) return;
    
        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }
    
            return client.users.cache.get(mention);
        }
    }
    const time_utc = new Date().getTime();

	if(!message.member.hasPermission("MANAGE_MESSAGES") && message.author.id !== '325893549071663104'){
        return message.channel.send("You don't have the permissions to use this command!");
    }

    var bad_person;
    if(!getUserFromMention(args[0])){return message.channel.send('Please mention a user')}
    else{
        args.shift()
        var bad_person = getUserFromMention(args[0]);
    }
    if(!args[0]) {args[0] = 'list'}//return message.channel.send("Please state a reason or action")
    var action = args[0].toLowerCase();
    if (!['add','list','removeall'].includes(args[0])){action = 'add';}
    else{
        args.shift();
    }
    const reason = args.join(' ');
    console.log(action)
    

    
    


    

    const uri = client.config.dbpath;
    const guildID = message.guild.id;
    const member = message.mentions.users.first()
    const memberID = member.id.toString();



    
    
    
    if(action == 'list'){
        //var data = fs.readFileSync(config['dbpath']),user_data;

       
	
        
        var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        mongoClient.connect(err => {
            if (err) return console.error(err);
            const collection = mongoClient.db("botdb").collection("v2");
            collection.findOne({id: guildID}, function(err, result){
                var db_data = result
                var user_data = db_data.users[memberID]
                if (err) {console.error(err); throw err};
                if(!user_data){return message.channel.send('Could not find that user, did you run !dbadd?')}
                if(user_data['warns'][0]){

                    const userID = memberID
                    const user = client.users.cache.get(userID);
                    const userTAG = user.tag;
                    
                    const warnings = user_data.warns;
                    
                    
                    const embed = new Discord.MessageEmbed()
        
                    embed.setColor("#ff00ff");
                    embed.setTitle('Warnings for user: '+userTAG);
                    embed.addFields();
                    for (var i = 0; i < warnings.length; i++){
                        var date_time = new Date(warnings[i]['time']).toDateString()
                        
                        embed.addField(date_time+' - by '+client.users.cache.get(warnings[i]['warner']).tag, 'Reason: ' + warnings[i]['warn']);
                    }
                    embed.setThumbnail(user.avatarURL());
        
                    message.channel.send(embed);
        
                } else {message.channel.send('Could not find any warnings!')}
                mongoClient.close();
            });
            
	    });



    }
    if(action == 'add'){
        if(args[0]){
            /*const uri = config['dbpath'];
            var user_promise = new Promise(function(resolve, reject){
                var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
                mongoClient.connect(err => {
                    if (err) throw err;
                    const collection = mongoClient.db("botdb").collection("v2");
                    collection.findOne({id:guildID}, function(err, result){
                        if (err) {console.error(err); throw err};
                        mongoClient.close();
                        setTimeout(function(){
                            resolve(result);
                        }, 100);
                            
                    });
                });
            });

            user_promise.then(function(value) {
                console.log(value);
                if(!value){message.channel.send('Could not find user, did you run !dbadd?')}
                else{
            let db_data = value;*/
            
            

            

            
            


            // Extract data used for warings
            /*user = user_data[member_uuid];
            var warning_data = user_data[member_uuid]['warn'];
            if(!warning_data){
                var warning_data = []
            }*/

            

            // Constructing the warning
            var new_warning = {};
            //const bad_person_uuid =  user['uuid']
            new_warning['time'] = time_utc;
            new_warning['warner'] = message.author.id;
            new_warning['warn'] = reason;
            

        

            // Saving data
            //db_data.warns.push(new_warning);
            

            /*fs.writeFile(config['dbpath'], write_data, function (err) {
            if (err) {
                console.log('There has been an error saving your data.');
                console.log(err.message);
                return;
            }
            console.log('Data saved successfully.')
            });*/




            var newquery = {id: message.guild.id};
            const locate_string = "users."+memberID+".warns"
            var newnewvalues = { $addToSet: {[locate_string]:new_warning}}




            const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("v2");
                // perform actions on the collection object
                collection.updateOne(newquery, newnewvalues, function(err, res){
                    if (err) throw err;
                    console.log("1 document inserted");
                    mongoClient.close();
                });
                
            });

            // Making embed
            var bad_pfp = member.avatarURL()
            const embed = new Discord.MessageEmbed()
            embed.setColor("#ff0000");
            embed.setTitle('User: '+member.tag+' has been warned');
            embed.addField('Reason: ', reason);
            embed.setThumbnail(bad_pfp);

            // Post embed
            message.channel.send(embed);
        }
    }
    if(action == 'removeall'){
        
        /*const uri = config['dbpath'];
        var user_promise = new Promise(function(resolve, reject){
            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) throw err;
                const collection = mongoClient.db("botdb").collection("users");
                collection.findOne({id: memberID, guild: guildID}, function(err, result){
                    if (err) {console.error(err); throw err};
                    mongoClient.close();
                    setTimeout(function(){
                        resolve(result);
                    }, 100);
                        
                });
            });
        });

        user_promise.then(function(value) {*/
        
        
        try{
            //let db_data = value;
            

            // Constructing the warning
            
            

        

            // Saving data
           //db_data.warns.length = 0;
           var newquery = {id: message.guild.id};
           const locate_string = "users."+memberID+".warns"
           var newnewvalues = { $set: {[locate_string]:[]}}
        
            const mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) console.log(err);
                const collection = mongoClient.db("botdb").collection("v2");
                // perform actions on the collection object
                collection.updateOne(newquery, newnewvalues, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted");
                    mongoClient.close();
                });
                
            });

            // Making embed
            var bad_pfp = member.avatarURL()
            const embed = new Discord.MessageEmbed()
            embed.setColor("#00ff00");
            embed.setTitle('Warnings for user: '+member.tag+' have been deleted');
            embed.setThumbnail(bad_pfp);

            // Post embed
            message.channel.send(embed);

        }
        catch(err){
            console.log(err)
        }
    
    

    /*fs.writeFile(config['dbpath'], write_data, function (err) {
    if (err) {
        console.log('There has been an error saving your data.');
        console.log(err.message);
        return;
    }
    message.channel.send('Deleted the warnings from <@' + message.mentions.users.first().id + '>')
    });*/
    }

    //message.channel.send("Command 
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"warn",
    description: "Warns the user in chat and safes the warning, command includes: 'add', 'list' and 'removeall'",
    usage: "!warn user [action (if none then add)] [reason]"
  };