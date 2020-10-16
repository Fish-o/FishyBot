const Discord = require('discord.js');
const fs = require('fs');
function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}
function jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.run = async (client, message, args) => {
	if (!args[0]) {
        let cats = {};
        client.commands.forEach(c=>{if(c.help.category != 'debug'){if(!cats[c.help.category]){cats[c.help.category] = []} cats[c.help.category].push({  name:c.help.name,
                                                                                                                                                        desc:c.help.description,
                                                                                                                                                        usage:c.help.usage})}})
        cats=sortOnKeys(cats)


        let color = "#5555ff";
        const InfoEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setAuthor(client.user.tag, client.user.displayAvatarURL(), 'https://fishman.live/')
        .setTitle('FishyBot help page')
        .setDescription(
`This is the [FishyBot](https://fishman.live) help page.
There are ${Object.keys(cats).length} categories:
**${Object.keys(cats).join('**\n**')}**
To get more info about a specific category type \`!help (category name)\`.
To get more info about a specific command, type \`!help (command name)\`

If you need any more help ask an admin, moderator, or message ${client.config.author}.`)
        
    

        
        message.channel.send(InfoEmbed);

        /*Object.keys(cats).forEach(async cat_name =>{
            let color = "#b0d9f5";
            if(1==1){
            } else if(cat_name == 'admin'){
                color = '#ff2525'
            } else if(cat_name == 'games'){
                color = '#00f5b4'
            }else if(cat_name == 'info'){
                color = '#2525ff'
            }else if(cat_name == 'levels'){
                color = '#ca03fc'
            }else if(cat_name == 'mod'){
                color = '#2534ff'
            }else if(cat_name == 'music'){
                color = '#c90000'
            }

            

            const Embed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(client.user.tag, client.user.displayAvatarURL(), 'https://fishman.live/')
            .setTitle(jsUcfirst(cat_name));
            
            cats[cat_name].forEach(command_data=>{
                Embed.addField(command_data.name, command_data.usage);
            })


            
            message.author.send(Embed);

            await sleep(500);


        })    */
    
    } else {
        let color = "#b0d9f5";
        let cats = {};
        client.commands.forEach(c=>{if(c.help.category != 'debug'){if(!cats[c.help.category]){cats[c.help.category] = []} cats[c.help.category].push({  name:c.help.name,
                                                                                                                                                        desc:c.help.description,
                                                                                                                                                        usage:c.help.usage})}})
        cats=sortOnKeys(cats)
        let command = args[0];
        if(client.commands.has(command)) {

            help_command_obj = client.commands.get(command);
            let perms = '\`';
            help_command_obj.conf.perms.forEach(perm=>{
                perms = perms + perm +'\`,'
            })
            if(perms == '\`'){
                perms = 'No permisions needed'
            } else {
                perms = perms.substring(0, perms.length - 1);
            }

            const CommandEmbed = new Discord.MessageEmbed()
            .setColor(color)
            .setAuthor(client.user.tag, client.user.displayAvatarURL(), 'https://fishman.live/')
            .setTitle(`Help for: ${help_command_obj.help.name}`)
            .addField('Name and aliases',`\`${help_command_obj.help.name}\`, \`${help_command_obj.conf.aliases.join('\`, \`')}\``)
            .addField('Description', help_command_obj.help.description)
            .addField('Usage', help_command_obj.help.usage)
            .addField('Required permisions', perms);
            message.channel.send(CommandEmbed);
            
        }; 
        if(Object.keys(cats).includes(command.toLowerCase())){
                let cat = command.toLowerCase();
                
                if(1==1){} 
                else if(cat == 'admin'){
                    color = '#ff2525'
                } else if(cat == 'games'){
                    color = '#00f5b4'
                }else if(cat == 'info'){
                    color = '#2525ff'
                }else if(cat == 'levels'){
                    color = '#ca03fc'
                }else if(cat == 'mod'){
                    color = '#2534ff'
                }else if(cat == 'music'){
                    color = '#c90000'
                }
                
                
                const CatEmbed = new Discord.MessageEmbed()
                .setColor(color)
                .setAuthor(client.user.tag, client.user.displayAvatarURL(), 'https://fishman.live/')
                .setTitle('Help for: '+ jsUcfirst(cat));
                
                
                
                if(cat == 'admin'){
                    CatEmbed.setDescription('Commands in the admin category are made to help and assist admins, these commands require high permissions to user.')
                } else if(cat == 'games'){
                    CatEmbed.setDescription('Commands in the game category let server members show off their stats in certain games.')
                }else if(cat == 'info'){
                    CatEmbed.setDescription('Commands in the info category give info about the server, bots, members, and more.')
                }else if(cat == 'levels'){
                    CatEmbed.setDescription('Commands in the levels category have to do with the xp and ranking system, that rewards members for chatting in the server.')
                }else if(cat == 'mod'){
                    CatEmbed.setDescription('Commands in the mod category make moderating easier and helps moderators.')
                }else if(cat == 'music'){
                    CatEmbed.setDescription('Commands in the music category allow members to play audio in a voice channel.')
                }else if(cat == 'randomstuff'){
                    CatEmbed.setDescription('Just stuff that didnt fit nicely in any other categories, try some out')
                }else if(cat == 'usercommands'){
                    CatEmbed.setDescription('Commands in the usercommands category allow members to add data like usernames and region data to their account.')
                } else {
                    CatEmbed.setDescription('Nameless category')
                }

                cats[cat].forEach(command_data=>{
                    CatEmbed.addField(command_data.name, command_data.usage)
                })
                message.channel.send(CatEmbed);
        };
	}
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"help",
    description: "Shows the help page of any command, or a list of commands",
	usage: "!help [command / category]"
};