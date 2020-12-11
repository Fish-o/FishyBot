var fs = require("fs");

const  Guild = require('../../database/schemas/Guild')


exports.run = async (client, message, args) => {

    if(!args[0]){return}

    var command = args[0].toLowerCase();
    var action = args[1];
    var guildID = message.guild.id;
    
    auto_commands = ['dadjokes']
    if(command == 'global' && message.author.id == client.config.master){
        const locate_string = "settings."+action
        let guilds = client.guilds.cache
        guilds.forEach(guild =>{
            var guildQuery = {id: guild.id};
            var newnewvalues = {[locate_string]:false}
            client.updatedb( guildQuery, newnewvalues, "done some shit", message.channel)
        })
        

    }
    if(command == 'list'){
        let cache_raw = fs.readFileSync(__dirname + '/../../jsonFiles/cache.json');
        let cache = JSON.parse(cache_raw);
    
        
        
        let commands=['If a command is not listed then it is enabled by defualt']

        let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == guildID)
        Object.keys(guild_cache.settings).forEach(setting =>{
            let status = 'enabled'
            if(guild_cache.settings[setting] == false){
                status = 'disabled'
            }
            commands.push(`${setting}: ${status}`)
        })
        message.channel.send(commands.join("\n"))

    }


    else if(command == 'levels'){
        const locate_string = "settings.levels"
        if(action == 'off' || !action){
            var guildQuery = {id: guildID};
            
            await Guild.updateOne(guildQuery, {[locate_string]:false});
            message.channel.send("Disabled the leveling system")
        }else if(action == 'on'){
            var guildQuery = {id: guildID};

            await Guild.updateOne(guildQuery, {[locate_string]:true});
            message.channel.send("Enabled the leveling system.")
        }
    } else if(command == 'all_auto'){
        const locate_string = "settings.all_auto"
        if(action == 'off' || !action){
            var guildQuery = {id: guildID};

            await Guild.updateOne(guildQuery, {[locate_string]:false});
            message.channel.send("Disabled all auto commands, it might take some time to apply the settings.")
        }else if(action == 'on'){
            var guildQuery = {id: guildID};

            await Guild.updateOne(guildQuery, {[locate_string]:true});
            message.channel.send("Enabled all auto commands, it might take some time to apply the settings.")
        }
    } else {
        auto_commands.forEach(async auto_command => {
            if(command == auto_command){
                const locate_string = `settings.${auto_command}`

                if(action == 'off' || !action){
                    var guildQuery = {id: guildID};

                    await Guild.updateOne(guildQuery, {[locate_string]:false}); 
                    message.channel.send(`Disabled the \`${auto_command}\` auto command, it might take some time to apply the settings.`)
                }else if(action == 'on'){
                    var guildQuery = {id: guildID};

                    await Guild.updateOne(guildQuery, {[locate_string]:true});
                    message.channel.send(`Enabled the \`${auto_command}\` auto command, it might take some time to apply the settings.`)
                }
            }
        });
        if(client.commands.has(command)){
            const locate_string = `settings.${command}`

            if(action == 'off' || !action){
                var guildQuery = {id: guildID};

                await Guild.updateOne(guildQuery, {[locate_string]:false});
                message.channel.send(`Disabled the \`${command}\` command, it might take some time to apply the settings.`)
            }else if(action == 'on'){
                var guildQuery = {id: guildID};

                await Guild.updateOne(guildQuery, {[locate_string]:true});
                message.channel.send(`Enabled the \`${command}\` command, it might take some time to apply the settings.`)
            }
        }
    }
    client.recache(client)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['preferences','setting','change'],
    perms: [
        'MANAGE_ROLES'
    ]
};
  
const path = require("path");
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"settings",
    description: `Allows admins to turn sertain features off or on. 
    Current settings:
    say
        allows people without perms to let the bot say things with !say
    
    all_auto
        all auto commands
    
    dadjokes
        its stupid ik
    `,
    usage: "settings [setting/list] [off/on]"
};
