var fs = require("fs");
const Discord = require("discord.js");
const  Guild = require('../../database/schemas/Guild')



    
let settingsCommand = async function(client, action, command, guildID, authorID){
    return new Promise(async(resolve, reject)=>{


       
        if(command == 'global' && authorID == client.config.master){
            const locate_string = "settings."+action
            let guilds = client.guilds.cache
            guilds.forEach(guild =>{
                var guildQuery = {id: guild.id};
                var newnewvalues = {[locate_string]:false}
                client.updatedb( guildQuery, newnewvalues)
                let embed = new Discord.MessageEmbed()
                    .setTitle('Disabled GLOBAL')
                    .setColor('GREEN')
                    .setTimestamp();
                resolve(embed)
                return
            })
            

        }
        if(command == 'list'){
            let commands=['If a command is not listed then it is enabled by defualt']

            let guild_cache = await client.getDbGuild(guildID)
            Object.keys(guild_cache.settings).forEach(setting =>{
                let status = 'enabled'
                if(guild_cache.settings[setting] == false){
                    status = 'disabled'
                }
                commands.push(`**${setting}**: \`${status}\``)
            })
            let embed = new Discord.MessageEmbed()
                .setTitle('Settings for this server')
                .setColor('Blue')
                .setDescription(commands.join("\n"))
                .setTimestamp();
            resolve(embed)
            return
        }


        else if(command == 'levels'){
            const locate_string = "settings.levels"
            if(action == 'off' || !action){
                var guildQuery = {id: guildID};
                
                await Guild.updateOne(guildQuery, {[locate_string]:false});
                let embed = new Discord.MessageEmbed()
                    .setTitle('Disabled the leveling system')
                    .setColor('RED')
                    .setTimestamp();
                resolve(embed)
                return
            }else if(action == 'on'){
                var guildQuery = {id: guildID};

                await Guild.updateOne(guildQuery, {[locate_string]:true});
                let embed = new Discord.MessageEmbed()
                    .setTitle('Enabled the leveling system')
                    .setColor('GREEN')
                    .setTimestamp();
                resolve(embed)
                return
            }
        }  else {
            if(client.commands.has(command)){
                const locate_string = `settings.${command}`

                if(action == 'off' || !action){
                    var guildQuery = {id: guildID};

                    await Guild.updateOne(guildQuery, {[locate_string]:false});
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Disabled the \`${command}\` command`)
                        .setColor('RED')
                        .setTimestamp();
                    resolve(embed)
                    return
                }else if(action == 'on'){
                    var guildQuery = {id: guildID};

                    await Guild.updateOne(guildQuery, {[locate_string]:true});
                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Enabled the \`${command}\` command`)
                        .setColor('GREEN')
                        .setTimestamp();
                    resolve(embed)
                    return
                }
            } else{
                let embed = new Discord.MessageEmbed()
                    .setTitle('Cant disable '+command)
                    .setDescription('Setting name not found')
                    .setColor('RED')
                    .setTimestamp();
                resolve(embed)
                return
            }
        }
    })
}



exports.run = async (client, message, args) => {

    if(!args[0]){return}

    var command = args[0].toLowerCase();
    var action = args[1];
    var guildID = message.guild.id;

    let embed = await settingsCommand(client, action, command, message.guild.id, message.author.id) ;
    return message.channel.send(embed|| message.error('Something has gone wrong!'));    
}
exports.interaction = async function(client, interaction, args){
    let setting;
    let value;
    if(args[0].name == 'set'){
        setting = args[0].options.find(option => option.name == "setting").value;
        value = args[0].options.find(option => option.name == "value").value;
    
    } else if(args[0].name == 'view'){
        setting = 'list'
    }

    if(value == false){
        value = 'off'
    } else{
        value = 'on'
    }
    let embed = await settingsCommand(client, value, setting, interaction.guild_id, interaction.member.id) ;
    interaction.send(embed|| interaction.error('Something has gone wrong!'));
}
exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        options:[
            {
                name:'View',
                description:'View the settings',
                type:1,
                default:false
            },
            {
                name:'set',
                description:'Set a setting',
                type:1,
                default:true,
                options:[
                    {
                        name:'Setting',
                        description:"The name of the setting to set",
                        required:true,
                        type:3
                    },
                    {
                        name:'Value',
                        description:"To turn it on or off",
                        required:true,
                        type:5
                    }
                ]
            }
        ]
    },
    aliases: ['preferences','setting','change'],
    perms: [
        'ADMINISTRATOR'
    ]
};
  
const path = require("path");

exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"settings",
    description: `Allows admins to turn commands and sertain features off or on.
    `,
    usage: "settings [command name] [off/on]"
};
