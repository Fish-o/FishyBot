const active = new Map();
const talkedRecently = new Set();
const { time } = require('console');
const Discord = require('discord.js');
var fs = require("fs");
const path = require("path");
const { config } = require('process');
const MongoClient = require('mongodb').MongoClient;




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

var very_good_name = async function(client, message) {
    // Fall back options to shut down the bot
    if(message.content == client.config.prefix + 'botshut' && message.author.id == client.master){
        client.sendinfo('Shutting down')
        client.destroy()
    } else if(message.content == 'botsenduptime' && message.author.id == client.master){
        client.sendinfo(`Uptime: ${client.uptime / 1000}`)
    }

    // Getting database uri
    const uri = client.config.dbpath;
    
    // I have no idea what this does
    let ops = {
        active: active
    }

    // Defining some stuff
    let args;
    let command;
    let cmd;
    
    // Ignore all bots
    if (message.author.bot) return;
    if (message.webhookID) return;
    if (message.channel instanceof Discord.DMChannel) return message.reply("This bot does not support DM messages");
    
    

    // Getting cache
    var cache_raw = null;
    var cache = null;

    try{
        var cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
        var cache = JSON.parse(cache_raw);
        
    } catch(err){
        client.recache()
        return
    }
    

    // Recaching if the time since it was last cached is shorter then recache_time
    const utc_time = new Date().getTime()
    const recache_time = 20 * 1000
    if(cache.timestamp+recache_time <= utc_time || (message.content == 'recache' && message.author.id == '325893549071663104')){
        
        // Updating member count
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
        // Recaching
        client.recache()
    }


    if(!message.guild){console.log(message)}

    // Find guild in cache
    //if(!cache.data.filter(db_guild => db_guild.id == message.guild.id)){return client.recache()}

    // If no guild was found, add a new one
    if(!cache.data.find(db_guild => db_guild.id == message.guild.id)){
        const guild = message.guild;
        guild.members.fetch().then((member_list) => {
    
            var guildObject = {
                id : guild.id,
                users:{},
                prefix:"!",
                settings:{
                    "dadjokes":false
                },
                custom_commands:{}
        }
    
            member_list.forEach(guild_member => {
                
                console.log('\n#####################################\n')
                
                
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
        // Get prefix
        const guild_prefix = cache.data.filter(db_guild => db_guild.id == message.guild.id)[0].prefix
        
    
        // Ignore messages not starting with the prefix from the guild, or the global one
        if (message.content.indexOf(client.config.prefix) == 0 ){
            args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
            command = args.shift().toLowerCase();
        }

        else if (message.content.indexOf(guild_prefix) == 0){   
            args = message.content.slice(guild_prefix.length).trim().split(/ +/g);
            command = args.shift().toLowerCase();
        } 

        // Handeling special commands (commands not needing a prefix)
        else {

            var guild_custom_commands = {};
            let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == message.guild.id)
            if(guild_cache.custom_commands){
                guild_custom_commands = guild_cache.custom_commands;
            }
            console.log(guild_custom_commands)
            var msg = message.content;
           

            
            asyncForEach(Object.keys(guild_custom_commands), async (guild_custom_command) => {
                console.log(guild_custom_command)
                let test = guild_custom_command;
                const responses = guild_custom_commands[guild_custom_command]
                let isRegex = true;
                try {
                    new RegExp(test);
                } catch(e) {
                    isRegex = false;
                }
                if(isRegex) {
                    console.log('isregex')
                    var response = responses[Math.floor(Math.random() * responses.length)];
                    var test_regex = new RegExp(test, 'g');
                
                    var result = msg.match(test_regex);
                    console.log('result: '+result)
                    if(result){
                        var after = msg.split(result)[-1];
                        
                        // Checking if there needs to be a response with a mention
                        if(response.includes("{mention}")){
                            if(!message.mentions.members.first()){
                                message.channel.send('This command needs you to mention someone')
                                response = ''
                            }
                            else{
                                response = response.replace("{mention}", `<@${message.mentions.members.first().id}>`)
                            }
                        };

                        // Replace the user
                        response = response.replace("{user}", `<@${message.author.id}>`)
                        
                        var match;
                        console.log(response)
                        // Insert random numbers
                        console.log('before while1')
                        while(match = /{r(\d+)\|(\d+)}/gi.exec(response)){
                            const whole = match[0];
                            const min = match[1];
                            const max = match[2];
                            const rand = Math.round(Math.random() * (max - min) + min);
                            response = response.replace(whole, rand);
                        }
                        
                        var time_matches,
                            splits = [response];
                        var sleeptime = 0;
                        console.log('before while2')
                        while(time_matches = /{w(\d+)}/gi.exec(response)){
                            console.log(splits)
                            console.log("time matches: "+time_matches)

                            var new_splits = splits[splits.length-1].split(time_matches[0])
                            splits.splice(-1,1)
                            splits.push(new_splits[0])
                            splits.push(new_splits[1])

                            //splits.push(splits[splits.length-1].split(time_matches[0])[-1])
                            console.log(splits)
                            message.channel.send(splits[splits.length-1]) 
                            await sleep(parseInt(time_matches[1]) *1000)
                            console.log(matched);
                        }

                    };
                    
                }
            })
            


            // Auto Commands
            if(!client.allow_test("all_auto", message.guild.id)){return}
            for (let [activation_key, value] of client.auto_activations) {
                if(message.content.toLowerCase().includes(activation_key)){
                    if(!client.allow_test(value, message.guild.id)){return}
                    cmd = client.auto_commands.get(value)
                    // If that command doesn't exist, silently exit and do nothing
                    if (!cmd) return;
                    cmd.run(client, message, ops);
                }
            }
            

        }


        // Our standard argument/command name definition.
        if (!command) return;
        if(!client.allow_test(command, message.guild.id)){return}
        
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


module.exports = very_good_name;