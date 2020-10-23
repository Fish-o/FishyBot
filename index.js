const Discord = require('discord.js');
const Enmap = require("enmap");
const moment  = require("moment");

const fs = require('fs');

const mongoose = require('mongoose')

const  User = require('./database/schemas/User')
const  Guild = require('./database/schemas/Guild')

const client = new Discord.Client();



require('dotenv').config();

let config = require("./jsonFiles/config.json");

config.token = process.env.TOKEN
config.dbpath = process.env.DBPATH
config.OLDDBPATH = process.env.OLDDBPATH
if(process.env.prefix){
    config.prefix = process.env.prefix;
}
config.igniteapi = process.env.igniteapi;

client.config = config;
const rawdata = fs.readFileSync(__dirname + '/jsonFiles/emojis.json');
const emoji_data = JSON.parse(rawdata);
client.emoji_data = emoji_data;
client.xpcooldown = {
    col: new Discord.Collection(),
    time: 15000

}

mongoose.connect(client.config.dbpath, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


console.log('Checking if cache file exists')
if(!fs.existsSync(__dirname + '/jsonFiles/cache.json')){
    fs.closeSync(fs.openSync(__dirname + '/jsonFiles/cache.json', 'w'));
}




console.log('Loading events')
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        //let eventName = file.split(".")[0];
        client.on(event.conf.event, event.event.bind(null, client));
    });
});

//client.commands = new Enmap();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.auto_commands = new Discord.Collection();
client.auto_activations = new Discord.Collection();


client.bypass = false;
client.master = client.config.master

console.log('Loading commands');

// Loads all the subcategories inside the commands dir
fs.readdir("./commands/", (direrr, dirs) =>{
    if (direrr) {
        return console.log('Unable to scan directory: ' + err);
    }
    console.log(dirs)
    

    // Cycles thru all sub direcoties
    dirs.forEach(dir => {

        // Make a path to that subdir
        const path = "./commands/"+dir+"/";
        // Read the contents of that subdir
        fs.readdir(path, (err, files) => {
            if (err) return console.error(err);

            // Go thru all files in the subdir
            files.forEach(file => {
                // Check if they end with .js
                if (!file.endsWith(".js")) return;
            
                // Load the command file
                let command_file = require(path+file);
                console.log(`Loading Command: ${command_file.help.name}`);
                
                // Set the command file to the client.commands map:
                // Map {name:command}
                client.commands.set(command_file.help.name, command_file);

                // Go thru all the aliases listed in the command file
                command_file.conf.aliases.forEach(alias => {
                    // Asign the aliases to the map
                    // {alias:name}
                    client.aliases.set(alias, command_file.help.name);
                });
            });
        });

    })
})

console.log('Loading autocommands');
fs.readdir("./auto_commands/", (direrr, dirs) =>{
    if (direrr) {
        return console.log('Unable to scan directory: ' + err);
    }
    console.log(dirs)
    
    dirs.forEach(dir => {
        const path = `./auto_commands/${dir}/`;
        fs.readdir(path, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
            
                let props = require(path+file);
                console.log(`Loading auto_commands: ${props.help.name}`);
                client.auto_commands.set(props.help.name, props);

                props.conf.activations.forEach(alias => {
                    client.auto_activations.set(alias, props.help.name);
                });
            });
        });

    })
})




/*
    READY
    RESUMED
    GUILD_CREATE
    GUILD_DELETE
    GUILD_UPDATE
    INVITE_CREATE
    INVITE_DELETE
    GUILD_MEMBER_ADD
    GUILD_MEMBER_REMOVE
    GUILD_MEMBER_UPDATE
    GUILD_MEMBERS_CHUNK
    GUILD_INTEGRATIONS_UPDATE
    GUILD_ROLE_CREATE
    GUILD_ROLE_DELETE
    GUILD_ROLE_UPDATE
    GUILD_BAN_ADD
    GUILD_BAN_REMOVE
    GUILD_EMOJIS_UPDATE
    CHANNEL_CREATE
    CHANNEL_DELETE
    CHANNEL_UPDATE
    CHANNEL_PINS_UPDATE
    MESSAGE_CREATE
    MESSAGE_DELETE
    MESSAGE_UPDATE
    MESSAGE_DELETE_BULK
    MESSAGE_REACTION_ADD
    MESSAGE_REACTION_REMOVE
    MESSAGE_REACTION_REMOVE_ALL
    MESSAGE_REACTION_REMOVE_EMOJI
    USER_UPDATE
    PRESENCE_UPDATE
    TYPING_START
    VOICE_STATE_UPDATE
    VOICE_SERVER_UPDATE
    WEBHOOKS_UPDATE



MISC
    INVITE_CREATE
    WEBHOOKS_UPDATE

SERVER
    GUILD_UPDATE
    GUILD_EMOJIS_UPDATE

ROLES
    GUILD_ROLE_CREATE
    GUILD_ROLE_DELETE
    GUILD_ROLE_UPDATE

CHANNEL
    CHANNEL_CREATE
    CHANNEL_DELETE
    CHANNEL_UPDATE

MESSAGE
    MESSAGE_DELETE
    MESSAGE_UPDATE
    MESSAGE_DELETE_BULK

MEMBERS
    GUILD_MEMBER_ADD
    GUILD_MEMBER_REMOVE
    GUILD_MEMBER_UPDATE //add role and stuff

BANS
    GUILD_BAN_ADD
    GUILD_BAN_REMOVE
*/


const events = {
    misc:[      'INVITE_CREATE',
                'WEBHOOKS_UPDATE'],

    server:[    'GUILD_UPDATE',
                'GUILD_EMOJIS_UPDATE'],

    role:[      'GUILD_ROLE_CREATE',
                'GUILD_ROLE_DELETE',
                'GUILD_ROLE_UPDATE'],

    channel:[   'CHANNEL_CREATE',
                'CHANNEL_DELETE',
                'CHANNEL_UPDATE'],

    message:[   'MESSAGE_DELETE',
                'MESSAGE_UPDATE',
                'MESSAGE_DELETE_BULK'],

    member:[    'GUILD_MEMBER_ADD',
                'GUILD_MEMBER_REMOVE',
                'GUILD_MEMBER_UPDATE'],

    ban:[       'GUILD_BAN_ADD',
                'GUILD_BAN_REMOVE']
}

client.on('WEBHOOKS_UPDATE', async function(channel){
    const TEXT = "Webhook updated"


    const guild = channel.guild;

    const DbGuild = await Guild.findOne({id: guild.id});
    const db_guild = DbGuild;

    if(!db_guild) return;
    if(!db_guild.logging) return;
    if(!db_guild.logging.webhook.id) return;
    
    
    
    if(!db_guild.logging){
        const locate = "logging";
        const value = {$set: {[locate]:{}}};
        client.updatedb(client, {id:channel.guild.id}, value);
    } 
    else if(db_guild.logging.WEBHOOKS_UPDATE.id){
        const log = new Discord.WebhookClient(db_guild.logging.webhook.id, db_guild.logging.webhook.token);

        const embed = new Discord.MessageEmbed()
            .setTitle(TEXT)
            .setTimestamp()
            .setDescription(`Channel: ${message.channel.name}`);

        webhookClient.send('fishy-bot-logging', {
            username: 'FishyBot-log',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed],
        });

    }

}.bind(null, client));

client.on('guildMemberUpdate', async function(oldMember, newMember) {
    const guild = oldMember.guild

    const DbGuild = await Guild.findOne({id: guild.id});
    const db_guild = DbGuild;

    if(!db_guild) return;
    if(!db_guild.logging) return;
    if(!db_guild.logging.webhook.id) return;
    
    const log = new Discord.WebhookClient(db_guild.logging.webhook.id, db_guild.logging.webhook.token);


    //var log = guild.channels.find('id', CHANNEL);

    //declare changes
    var Changes = {
        unknown: 0,
        addedRole: 1,
        removedRole: 2,
        username: 3,
        nickname: 4,
        avatar: 5
    };
    var change = Changes.unknown;

    //check if roles were removed
    var removedRole = '';
    oldMember.roles.cache.forEach(value => {
        if(newMember.roles.cache.find(value2 => value2.id== value.id) == null) {
            change = Changes.removedRole;
            removedRole = value.name;
        }
    });

    //check if roles were added
    var addedRole = '';
    newMember.roles.cache.forEach(value => {
        if(oldMember.roles.cache.find(value2 => value2.id== value.id) == null) {
            change = Changes.addedRole;
            addedRole = value.name;
        }
    });

    //check if username changed
    if(newMember.user.username != oldMember.user.username)
        change = Changes.username;

    //check if nickname changed
    if(newMember.nickname != oldMember.nickname)
        change = Changes.nickname;

    //check if avatar changed
    if(newMember.user.displayAvatarURL() != oldMember.user.displayAvatarURL())
        change = Changes.avatar;

    //post in the guild's log channel
    let embed = undefined;
    if (log != null) {
        switch(change) {
            case Changes.unknown:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User updated`)
                    .setColor('#0099ff');


                //log.send('**[User Update]** ' + newMember);
                break;
            case Changes.addedRole:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User role added`)
                    .setDescription(`<@${addedRole.id}>`)
                    .setColor('#00ff00');
                //log.send('**[User Role Added]** ' + newMember + ': ' + addedRole);
                break;
            case Changes.removedRole:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User role removed`)
                    .setDescription(`<@${removedRole.id}>`)
                    .setColor('#ff0000');
                //log.send('**[User Role Removed]** ' + newMember + ': ' + removedRole);
                break;
            case Changes.username:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User username changed`)
                    .addFields(
                        { name: 'Before: ', value: `${oldMember.user.username}#${oldMember.user.discriminator}`, inline: false },
                        { name: '+After: ', value: `${newMember.user.username}#${newMember.user.discriminator}`, inline: false },
                    )
                    .setColor('#0099ff');

                //log.send('**[User Username Changed]** ' + newMember + ': Username changed from ' +
                //    oldMember.user.username + '#' + oldMember.user.discriminator + ' to ' +
                //    newMember.user.username + '#' + newMember.user.discriminator);
                break;
            case Changes.nickname:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User nickname changed`)
                    .addFields(
                        { name: 'Before: ', value: `${oldMember.nickname}`, inline: false },
                        { name: '+After: ', value: `${newMember.nickname}`, inline: false },
                    )
                    .setColor('#0099ff');
                //log.send('**[User Nickname Changed]** ' + newMember + ': ' +
                //    (oldMember.nickname != null ? 'Changed nickname from ' + oldMember.nickname +
                //        + newMember.nickname : 'Set nickname') + ' to ' +
                //    (newMember.nickname != null ? newMember.nickname + '.' : 'original username.'));
                break;
            case Changes.avatar:
                embed = new Discord.MessageEmbed()
                    .setAuthor(`${newMember.user.username}#${newMember.user.discriminator}`, newMember.user.displayAvatarURL())
                    .setTitle(`User avatar changed`)
                    //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .setColor('#0099ff');
                //log.send('**[User Avatar Changed]** ' + newMember);
                break;
        }
    }
    if(embed){
        embed.setTimestamp()
        log.send({
            username: 'FishyBot-log',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed],
        });
    }
});





client.on('messageDelete', async function(message){
    const guild = message.guild



    const DbGuild = await Guild.findOne({id: guild.id});
    const db_guild = DbGuild;

    if(!db_guild) return;
    if(!db_guild.logging) return;
    if(!db_guild.logging.webhook.id) return;
    var embed;
    const log = new Discord.WebhookClient(db_guild.logging.webhook.id, db_guild.logging.webhook.token);
    if(log != null){
        embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}#${message.author.discriminator}`, message.author.displayAvatarURL())
            .setTitle(`Message deleted in #${message.channel.name}`)
            .setDescription(message.content)
            .setColor('#ff0000')
            .setTimestamp()
            .setFooter('AuthorID: '+message.author.id);
    }
    if(embed){
        log.send({
            username: 'FishyBot-log',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed],
        });
    }
});


client.on('roleCreate', async function(role){

    const guild = role.guild
    const DbGuild = await Guild.findOne({id: guild.id});
    const db_guild = DbGuild;

    if(!db_guild) return;
    if(!db_guild.logging) return;
    if(!db_guild.logging.webhook.id) return;

    var embed;
    const log = new Discord.WebhookClient(db_guild.logging.webhook.id, db_guild.logging.webhook.token);
    if(log != null){
        embed = new Discord.MessageEmbed()
            //.setAuthor(`r`, message.author.displayAvatarURL())
            .setTitle(`Role created`)
            .setDescription(`${role.name}, <@&${role.id}>`)
            .setColor('#00ff00')
            .setTimestamp()
            .setFooter('ID: '+role.id);
    }
    if(embed){
        log.send({
            username: 'FishyBot-log',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed],
        });
    }
});




client.on('roleDelete', async function(role){

    const guild = role.guild
    const DbGuild = await Guild.findOne({id: guild.id});
    const db_guild = DbGuild;

    if(!db_guild) return;
    if(!db_guild.logging) return;
    if(!db_guild.logging.webhook.id) return;

    var embed;
    const log = new Discord.WebhookClient(db_guild.logging.webhook.id, db_guild.logging.webhook.token);
    if(log != null){
        embed = new Discord.MessageEmbed()
            //.setAuthor(`r`, message.author.displayAvatarURL())
            .setTitle(`Role deleted`)
            .setDescription(`${role.name}, <@&${role.id}>`)
            .setColor('#ff0000')
            .setTimestamp()
            .setFooter('ID: '+role.id);
    }
    if(embed){
        log.send({
            username: 'FishyBot-log',
            avatarURL: client.user.displayAvatarURL(),
            embeds: [embed],
        });
    }
});
console.log('Done with logging');
events.misc
events.server
events.role
events.channel
events.message
events.member
events.ban







const dbtools = require("./utils/dbtools");

client.updatedb = dbtools.updatedb;
client.recache = dbtools.recache;
client.dbgetuser = dbtools.dbgetuser;

//client.elevation = dbtests.elevation;
client.allow_test = dbtools.allow_test;


const other = require("./utils/other");
client.getMember = other.getMember;

client.sendinfo = function (info){
    client.channels.cache.get('739211875610525746').send(info);
}
console.log('Logging on')




process.on('SIGTERM', () => {
    client.sendinfo('SIGTERM signal received: stopping bot')
    client.destroy()
})


client.login(config.token);