/*


custom commands


input
	regex


argumenten
	user mentions
	woord after it



output
	["Love meter between {user} & {mention} {w3} {r1|100}"]



*/

const Discord = require('discord.js');
exports.run = async function (client, message, args) {
    let action = 'new';
    `rand: {r10|20} {r10|20} {r10|20} rand done. w8 5 secs {w5} {user} {mention}`;


    // Check if valid json
    if (/^[\],:{}\s]*$/.test(args.join().replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {action = 'data'
    }else if(args[0] == 'new' || args[0] == 'add'){
        action = 'new';
        args.shift()
    }else if(args[0] == 'delete' || args[0] == 'remove'|| args[0] == 'del'){
        action = 'del'
        args.shift()
    } else{
        action = 'list'
        args.shift()
    }


    if(action == 'new'){
        message.channel.send("What should be the command name? , type `cancel` at any time to stop\nThe command name supports **regex** (dont need the //), to make it activate only at the beginning of a message use `^commandname`");
        var command_name_raw_msg = await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 120000})
        
        let command_name_raw = command_name_raw_msg.first().content;

        if(!command_name_raw_msg.first().mentions.channels.first()){
            if(command_name_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')};
        }

        let isRegex = true;
        try {
            new RegExp(command_name_raw);
        } catch(e) {
            isRegex = false;
        }
        if(isRegex) {
            var done = false;
            var proceed = true;
            var responses = []
            while (!done){
                message.channel.send("What should the response be? , type `cancel` at any time to stop\nExample command response: `Love meter between {user} and {mention}{w1}calculating...{w2}Their love is {r0|100}%`\n{user} - The user who called the command\n{mention} - the user who was mentioned in the message\n{w3} - waights for 3 seconds before sending the rest of the message\n{r0|100} - returns a random number between 0 and 100");
                var command_response_msg = await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 120000})
                
                let command_response = command_response_msg.first().content;

                if(!command_response_msg.first().mentions.channels.first()){
                    if(command_response.toLowerCase() == 'cancel'){proceed = false; return message.channel.send('Stopped')};
                }
                
                responses.push(command_response)
                

                var addnothermsglooop = true;

                while(addnothermsglooop == true){
                    message.channel.send("Do you want to add another respons? ( _yes_ or _no_ )");
                    var another_msg_raw = await message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 120000})
                    let another_msg = another_msg_raw.first().content;
                    if(!another_msg_raw.first().mentions.channels.first()){
                        if(another_msg.toLowerCase() == 'cancel'){proceed = false;addnothermsglooop = false;done = false; return message.channel.send('Stopped')};
                    }else if(another_msg.toLowerCase() == 'yes'){
                        addnothermsglooop = false;
                    }else if(another_msg.toLowerCase() == 'no'){
                        done = true;
                        addnothermsglooop = false;
                    }
                }
            }
            if(proceed){

                const locate = "custom_commands."+command_name_raw;
                const value = {$set: {[locate]:responses}};
                client.updatedb({id:message.guild.id}, value, `Added custom command!`, message.channel)

            }
        }else return message.channel.send('That command name is invalid!');
    } else if(action == 'data'){
        const obj = JSON.parse(args.join(' '))
        if(!obj.a || !Array.isArray(obj.b)){
            return message.channel.send('That json is invalid!')
        }


        const locate = "custom_commands."+obj.a;
        const value = {$set: {[locate]:obj.b}};
        client.updatedb({id:message.guild.id}, value, `Added custom command: ${obj.a}!`, message.channel)
    } else if(action == 'del'){
        if(Number.isInteger(args[0])){
            var cache_raw = fs.readFileSync(__dirname + '/../../jsonFiles/cache.json');
            var cache = JSON.parse(cache_raw);
            const cache_guild = cache.data.filter(db_guild => db_guild.id == message.guild.id)[0]
            const cache_guild_custom_commands = cache_guild.custom_commands;
            if(cache_guild_custom_commands.length < parseInt(args[0])){
                message.channel.send('Index is out to big.')
            } else{
                const name = Object.keys(cache_guild_custom_commands)[parseInt(args[0])];

                const array = cache_guild_custom_commands[name]
                
                if(!array || !name){
                    message.channel.send('Could not find the command')
                } else{
                    console.log('name to delete: '+name)
                    const locate = "custom_commands."+name;
                    const value = {$set: {[locate]:undefined}};
                    client.updatedb({id:message.guild.id}, value, `Removed custom command: ${name}!`, message.channel)
                    return
                }
            }
        }
        if(args[0]){
            const locate = "custom_commands."+args.join(' ');
            const value = {$set: {[locate]:undefined}};
            client.updatedb({id:message.guild.id}, value, `Removed custom command: ${args.join(' ')}!`, message.channel)
        }
    } else if(action == 'list'){
        var cache_raw = fs.readFileSync(__dirname + '/../../jsonFiles/cache.json');
        var cache = JSON.parse(cache_raw);
        const cache_guild = cache.data.filter(db_guild => db_guild.id == message.guild.id)[0]
        const cache_guild_custom_commands = cache_guild.custom_commands;
        if(!cache_guild_custom_commands){
            const locate = "custom_commands";
            const value = {$set: {[locate]:{}}};
            client.updatedb({id:message.guild.id}, value, `Something went wrong, it should be fixxed now, try again!`, message.channel)
        } else{
            const embed = new Discord.MessageEmbed();
            embed.setTitle('All custom commands of this server')
            Object.keys(cache_guild_custom_commands).forEach(obj_key => {
                if(cache_guild_custom_commands[obj_key] == null){
                    return message.channel.send('No custom commands found')
                }
                console.log('all cc\'s: '+cache_guild_custom_commands);
                console.log('key: '+obj_key);
                console.log('all keys: '+Object.keys(cache_guild_custom_commands))
                console.log('index: '+Object.keys(cache_guild_custom_commands).indexOf(obj_key));
                const indexx = Object.keys(cache_guild_custom_commands).indexOf(obj_key);
                embed.addField(`[${indexx}]: ${obj_key}`, ` ${cache_guild_custom_commands[obj_key].length} responses`, false)


            });
            message.channel.send(embed);
        }
    }

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['customcommands', 'custom_commands'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"custom",
    description: 
`
**NOT DONE YET!!!**

Allows you to make a custome command with multiple responses.

List all custom commands:
!custom list

List all responses to a custom command:
!custom list (command name/index)

Make new and delete commands
!custom new (command name)
!custom delete (command name/index)

Add and remove responses to a command
!custom set (command name/index) data
~~!custom add (command name/index) (response index)~~
!custom remove (command name/index) (response index)


Use the \`list\` options to obtain the indexes

`,
    usage: "View `!help custom` for info"
};
