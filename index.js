const Discord = require('discord.js');
const Enmap = require("enmap");
const moment  = require("moment");
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const client = new Discord.Client();



require('dotenv').config({ path: './secrets.env' });

let config = require("./jsonFiles/config.json");

config.token = process.env.TOKEN
config.dbpath = process.env.DBPATH
if(process.env.prefix){
    config.prefix = process.env.prefix;
}
config.igniteapi = process.env.igniteapi;

client.config = config;
const rawdata = fs.readFileSync(__dirname + '/jsonFiles/emojis.json');
const emoji_data = JSON.parse(rawdata);
client.emoji_data = emoji_data;




fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

//client.commands = new Enmap();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

client.auto_commands = new Discord.Collection();
client.auto_activations = new Discord.Collection();


client.bypass = false;
client.master = client.config.master

fs.readdir("./commands/", (direrr, dirs) =>{
    if (direrr) {
        return console.log('Unable to scan directory: ' + err);
    }
    console.log(dirs)
    
    dirs.forEach(dir => {
        const path = "./commands/"+dir+"/";
        fs.readdir(path, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
            
                let props = require(path+file);
                console.log(`Loading Command: ${props.help.name}`);
                client.commands.set(props.help.name, props);

                props.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, props.help.name);
                });
            });
        });

    })
})

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

client.on('WEBHOOKS_UPDATE', function(client, channel){
    const TEXT = "Webhook updated"

    const Discord = require('discord.js');
    const cache_raw = fs.readFileSync(__dirname + '/jsonFiles/cache.js');
    const cache = JSON.parse(cache_raw);
    const cache_guild = cache.data.find(guild => guild.id == channel.guild.id);

    
    
    if(!cache_guild.logging){
        const locate = "logging";
        const value = {$set: {[locate]:{}}};
        client.updatedb({id:channel.guild.id}, value);
    } 
    else if(cache_guild.logging.WEBHOOKS_UPDATE.id){
        const webhookClient = new Discord.WebhookClient(cache_guild.logging.WEBHOOKS_UPDATE.id, cache_guild.logging.WEBHOOKS_UPDATE.token);

        const embed = new Discord.MessageEmbed()
            .setTitle(TEXT)
            .setTimestamp();

        webhookClient.send('fishy-bot-logging', {
            username: 'FishyBot',
            avatarURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/259/fish_1f41f.png',
            embeds: [embed],
        });

    }

}.bind(null, client));

client.on('guildMemberUpdate', function(guild, oldMember, newMember) {
    const uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.findOne({id:guild.id}, function(err, db_guild) {
            if (err) {console.error(err); throw err};
            
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
            oldMember.roles.every(function(value) {
                if(newMember.roles.find('id', value.id) == null) {
                    change = Changes.removedRole;
                    removedRole = value.name;
                }
            });

            //check if roles were added
            var addedRole = '';
            newMember.roles.every(function(value) {
                if(oldMember.roles.find('id', value.id) == null) {
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
            if(newMember.user.avatarURL != oldMember.user.avatarURL)
                change = Changes.avatar;

            //post in the guild's log channel
            
            if (log != null) {
                switch(change) {
                    case Changes.unknown:
                        log.send('**[User Update]** ' + newMember);
                        break;
                    case Changes.addedRole:
                        log.send('**[User Role Added]** ' + newMember + ': ' + addedRole);
                        break;
                    case Changes.removedRole:
                        log.send('**[User Role Removed]** ' + newMember + ': ' + removedRole);
                        break;
                    case Changes.username:
                        log.send('**[User Username Changed]** ' + newMember + ': Username changed from ' +
                            oldMember.user.username + '#' + oldMember.user.discriminator + ' to ' +
                            newMember.user.username + '#' + newMember.user.discriminator);
                        break;
                    case Changes.nickname:
                        log.send('**[User Nickname Changed]** ' + newMember + ': ' +
                            (oldMember.nickname != null ? 'Changed nickname from ' + oldMember.nickname +
                                + newMember.nickname : 'Set nickname') + ' to ' +
                            (newMember.nickname != null ? newMember.nickname + '.' : 'original username.'));
                        break;
                    case Changes.avatar:
                        log.send('**[User Avatar Changed]** ' + newMember);
                        break;
                }
            }
            mongoClient.close();
        });
    });
    

});

events.misc
events.server
events.role
events.channel
events.message
events.member
events.ban

























client.allow_test = function(cmd_name, guild_id){
    let cache_raw = fs.readFileSync(__dirname + '/jsonFiles/cache.json');
    let cache = JSON.parse(cache_raw);

    const locate_string = cmd_name
    
    let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == guild_id)
    if(guild_cache.settings[cmd_name] == false){return false}
    
    return true
}


client.recache = async function (){
    const uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.find({}).toArray(function(err, result) {
            if (err) {console.error(err); throw err};
            mongoClient.close();
            var data = {timestamp:new Date().getTime(),
                data:result}

            var jsonData = JSON.stringify(data);
            var fs = require('fs');

            fs.writeFile(__dirname + '/jsonFiles/cache.json', jsonData, function(err) {
                if (err) {
                    console.log(err);
                }
            }); 
        });
    });
}

client.updatedb = function(query, value, msg = '', channel = null) {
    const uri = client.config.dbpath;

    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) console.log(err);
        const collection = mongoClient.db("botdb").collection("v2");
        collection.updateOne(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            mongoClient.close();
            if(msg != '' && channel){
               channel.send(msg)
            }
        });
    })


}


client.elevation = function (msg) {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification*/
    let permlvl = 0;

    let mod_role = msg.guild.roles.find("name", "Moderator");
    if (mod_role && msg.member.roles.has(mod_role.id)) permlvl = 2;

    let admin_role = msg.guild.roles.find("name", "Administratorl");
    if (admin_role && msg.member.roles.has(admin_role.id)) permlvl = 3;

    if (msg.author.id === "325893549071663104") permlvl = 4;
    return permlvl;
};


client.sendinfo = function (info){
    client.channels.cache.get('739211875610525746').send(info);
}

client.login(config.token);