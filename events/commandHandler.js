const active = new Map();
const talkedRecently = new Set();

const Discord = require('discord.js');
var fs = require("fs");

const MongoClient = require('mongodb').MongoClient;

const  User = require('../database/schemas/User')
const  Guild = require('../database/schemas/Guild');
const { relativeTimeRounding } = require('moment');




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

var very_good_name = async function(client, message) {
    if(message.partial)
        return;
    // Fall back options to shut down the bot
    if(message.content == client.config.prefix + 'botshut' && message.author.id == client.master){
        client.sendinfo('Shutting down')
        client.destroy()
    } else if(message.content == 'botsenduptime' && message.author.id == client.master){
        
        client.sendinfo(`Uptime: ${client.uptime / 1000}`)
    }


    
    
    // I have no idea what this does
    // Figured it out, its for the music commands
    let ops = {
        active: active
    }

    // Defining some stuff
    let args;
    let command;
    let cmd;
    
    // Ignore all bots and other useless stuff
    if (message.author.bot) return;
    if (message.webhookID) return;
    if (message.channel instanceof Discord.DMChannel) return message.reply("blub ".repeat(Math.ceil(Math.random()*50)));
    
    var guildID = message.guild.id;
    

    // Getting cache
    var cache_raw = null;
    var cache = null;

    try{
        cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
        cache = JSON.parse(cache_raw);
        
    } catch(err){
        client.recache(client)
        return
    }


    if(!message.guild){console.log(message)}

    // Find guild in cache
    //if(!cache.data.filter(db_guild => db_guild.id == message.guild.id)){return client.recache(client)}

    // If no guild was found, add a new one
    if(cache.data.find(db_guild => db_guild.id == message.guild.id) == undefined){
        console.log('not found')
        const dbGuild = await Guild.findOne({id:message.guild.id});
        if(!dbGuild){
            console.log('not found2');
            const uri = client.config.OLDDBPATH
            const guild = message.guild;
            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                if (err) throw err;
                const collection = mongoClient.db("botdb").collection("v2");
                collection.findOne({id:message.guild.id}, async function(err, result){
                    if (err) {console.error(err); throw err};
                    var db_data = result;
                    
                    if(db_data){
                        let member_list = await guild.members.fetch();
                        let memberidlist = []

                        
                        member_list.forEach( async (member)=>{
                            memberidlist.push(member.id)
                            await User.findOneAndUpdate({discordId:member.id },{
                                id:guildID, 
                                discordTag:member.user.tag,
                                avatar:member.user.avatar
                            }, { upsert: true, setDefaultsOnInsert: true })
                        })

                        let prefix = db_data.prefix
                        let settings = {"dadjokes":false}
                        let warns = {}
                        let usernames = {};
                        let member_count_channel = undefined;
                        let logging = undefined;
                        let joinMsg = undefined;
                        let custom_commands = undefined
                        
                        await Object.keys(db_data.users).forEach(userId=>{
                            if(db_data.users[userId].data){
                                if(db_data.users[userId].data.usernames){
                                    usernames[userId] = db_data.users[userId].data.usernames
                                }
                                
                            }
                            if(db_data.users[userId].warns){
                                warns[userId] = db_data.users[userId].warns;
                            }
                        })

                        if(db_data.joinMsg){
                            joinMsg = db_data.joinMsg
                        }

                        if(db_data.custom_commands){
                            custom_commands = db_data.custom_commands;
                        }

                        if(db_data.settings){
                            settings = db_data.settings;
                        }

                        if(db_data.member_count_channel){
                            member_count_channel = db_data.member_count_channel;
                        }
                        
                        if(db_data.logging){
                            logging = db_data.logging;
                        }


                        await Guild.findOneAndUpdate({id:guildID }, {id:message.guild.id, memberlist:memberidlist,
                            prefix,
                            settings,
                            warns,
                            usernames,
                            member_count_channel,
                            logging,
                            joinMsg,
                            custom_commands
                            
                        }, { upsert: true, setDefaultsOnInsert: true });
                        return client.recache()

                    } 
                    else {
                        client.sendinfo(`[GUILD DB ADD] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);
                        
                        guild.members.fetch().then( async (member_list) => {
                            let memberidlist = []

                            member_list.forEach( async (member)=>{
                                memberidlist.push(member.id)
                                await User.findOneAndUpdate({discordId:member.id },{
                                    id:guildID, 
                                    discordTag:member.user.tag,
                                    avatar:member.user.avatar
                                }, { upsert: true, setDefaultsOnInsert: true })
                            })
                            await Guild.findOneAndUpdate({id:guildID }, {id:guildID, memberlist:memberidlist}, { upsert: true, setDefaultsOnInsert: true });
                            return client.recache();
                        })
                    }
                })
            })
            
        }
        
        console.log(message.guild.name)
    
    }
    else{

        // Get guild cache
        let guild_cache = await client.getDbGuild(message.guild.id) //cache.data.find(guild_cache_raw => guild_cache_raw.id == message.guild.id)
        

        // Checking for an existing filter and the members permisions
        if(guild_cache.filters && guild_cache.filters[message.channel.id]){
            try{
                let regex = new RegExp(guild_cache.filters[message.channel.id], 'im')
                if(!regex.test(message.content) && !message.member.hasPermission('MANAGE_MESSAGES')){
                    message.delete()
                    message.author.send(`Your message in \`${message.guild.name}\` => \`${message.channel.name}\` has been deleted`)
                }
            }catch(err){
                client.sendinfo('error with filtering')
                console.log(err)
                message.channel.send('Something has gone wrong with the text filter on this channel')
            }
        }

        // Getting guild prefix
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
        if(!client.commands.has(command)){
            var guild_custom_commands = {};
            
            if(guild_cache.custom_commands){
                guild_custom_commands = guild_cache.custom_commands;
            }else{
                const locates = "custom_commands";
                const values = {[locates]:{}};
                client.updatedb( {id:message.guild.id}, values)
            }
            var msg = message.content;
           

            Object.keys(guild_custom_commands).forEach( async (guild_custom_command) => {
                let test = guild_custom_command;
                const responses = guild_custom_commands[guild_custom_command]

                if(!responses[0])
                    return;
                let isRegex = true;
                try {
                    new RegExp(test);
                } catch(e) {
                    isRegex = false;
                }
                if(isRegex) {
                    var response = responses[Math.floor(Math.random() * responses.length)];
                    var test_regex = new RegExp(test, 'gi');
                
                    var result = msg.match(test_regex);
                    if(result){
                        var after = msg.split(result)[-1];
                        
                        // Checking if there needs to be a response with a mention
                        if(response.includes("{mention}")){
                            if(!message.mentions.members.first()){
                                message.channel.send('This command needs you to mention someone')
                                response = ''
                            }
                            else{
                                response = response.replace(/\{mention\}/g, `<@${message.mentions.members.first().id}>`)
                            }
                        };

                        // Replace the user
                        response = response.replace(/\{user\}/g, `<@${message.author.id}>`)
                        
                        var match;
                        while(match = /{r(\d+)\|(\d+)}/gi.exec(response)){
                            const whole = match[0];
                            let min = match[1];
                            let max = match[2];
                            min = Math.ceil(min);
                            max = Math.floor(max);
                            

                            const rand = Math.floor(Math.random() * (max - min + 1)) + min;
                            response = response.replace(whole, rand);
                        };
                        
                        var time_match;
                        var sleeptime = 0;
                        const find_time = /{w(\d+)}/i;

                        var matching = true
                        while(matching == true){

                            time_match = response.match(find_time);
                            if(time_match == null){
                                matching = false;
                                return message.channel.send(response)
                            }

                            const index = response.indexOf(time_match[0]);
                            
                            var splits = [];
                            message.channel.send(response.substring(0, index))
                            response = response.substring(index +time_match[0].length);
                            await sleep(parseInt(time_match[1]) *1000);
                            
                        }

                    };
                    
                }
            })
            


            // Auto Commands
            if(await client.allow_test("all_auto", guild_cache)){
                for (let [activation_key, value] of client.auto_activations) {
                    if(message.content.toLowerCase().includes(activation_key)){
                        if(!await client.allow_test(value, guild_cache)){return}
                        cmd = client.auto_commands.get(value)
                        // If that command doesn't exist, silently exit and do nothing
                        if (!cmd) return;
                        
                        cmd.run(client, message, ops);
                    }
                }
            }

        }


        // Our standard argument/command name definition.
        if (!command) return;
        if(!await client.allow_test(command, guild_cache)){return}
        
        // Grab the command data from the client.commands Enmap
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        }
        //const cmd = client.commands.get(command);
    
        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;



        // Check if the feature is enabled
        if(!guild_cache.features){
            
            const value = {features:[]}

            return client.updatedb( {id: message.guild.id}, value, 'Something went wrong, try again, if this message keeps apearing, please contact '+client.config.author, message.channel)
        }
        if(client.config.features.includes(cmd.help.category) && !guild_cache.features.includes(cmd.help.category) && !guild_cache.features.includes('all')){
            return message.channel.send('This is a premium feature, and not enabled on this server')
        };


        var succes = true;
        let required = 'You are missing the following permisions:\n';
        if(!client.bypass || message.author.id !== client.config.master){
            let permroles = [];

            if(guild_cache.roleperms){
                Object.keys(guild_cache.roleperms).forEach(roleid => {
                    if(message.member.roles.cache.has(roleid)){
                        permroles.push(guild_cache.roleperms[roleid]) 
                    }
                })
            }
            cmd.conf.perms.forEach(permision => {
                try{
                    if(!message.member.hasPermission(permision) && !permroles.find(perms => perms.includes(permision.toLowerCase()))){
                        succes = false;
                        required += permision + ' '
                    }
                }
                catch(err){
                    console.log(err)
                    return message.channel.send("Something went wrong, please contact "+client.config.author);
                }
            });
        }
        if(!succes) return message.channel.send(required);



        if (talkedRecently.has(message.author.id)) {
            message.channel.send("So fast! Wait a moment please!");
        } else {
            // Run the command
            cmd.run(client, message, args, guild_cache, ops);

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

exports.event = very_good_name;

exports.conf = {
    event: "message"
};