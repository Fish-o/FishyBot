var fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
exports.run = (client, message, args) => {
    const uri = client.config.dbpath;
    if(!args[0]){return}

    var command = args[0].toLowerCase();
    var action = args[1];
    var guildID = message.guild.id;
    
    auto_commands = ['dadjokes']

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


    else if(command == 'say'){
        const locate_string = "settings.say"
        if(action == 'off' || !action){
            var guildQuery = {id: guildID};
            var newnewvalues = { $set: {[locate_string]:false}}

            client.updatedb(guildQuery, newnewvalues, "Disabled the `say` command, it might take some time to apply the settings.", message.channel)
            
        }else if(action == 'on'){
            var guildQuery = {id: guildID};
            var newnewvalues = { $set: {[locate_string]:true}}


            client.updatedb(guildQuery, newnewvalues, "Enabled the `say` command, it might take some time to apply the settings.", message.channel)
        }
    } else if(command == 'all_auto'){
        const locate_string = "settings.all_auto"
        if(action == 'off' || !action){
            var guildQuery = {id: guildID};
            var newnewvalues = { $set: {[locate_string]:false}}
            client.updatedb(guildQuery, newnewvalues, "Disabled all auto commands, it might take some time to apply the settings.", message.channel)
            
        }else if(action == 'on'){
            var guildQuery = {id: guildID};
            var newnewvalues = { $set: {[locate_string]:true}}
            client.updatedb(guildQuery, newnewvalues, "Enabled all auto commands, it might take some time to apply the settings.", message.channel)
        }
    } else {
        auto_commands.forEach(auto_command => {
            if(command == auto_command){
                const locate_string = `settings.${auto_command}`

                if(action == 'off' || !action){
                    var guildQuery = {id: guildID};
                    var newnewvalues = { $set: {[locate_string]:false}}
                    client.updatedb(guildQuery, newnewvalues, `Disabled the \`${auto_command}\` auto command, it might take some time to apply the settings.`, message.channel)
                    
                }else if(action == 'on'){
                    var guildQuery = {id: guildID};
                    var newnewvalues = { $set: {[locate_string]:true}}
                    client.updatedb(guildQuery, newnewvalues, `Enabled the \`${auto_command}\` auto command, it might take some time to apply the settings.`, message.channel)
                }
            }
        });
        if(client.commands.has(command)){
            const locate_string = `settings.${command}`

            if(action == 'off' || !action){
                var guildQuery = {id: guildID};
                var newnewvalues = { $set: {[locate_string]:false}}
                client.updatedb(guildQuery, newnewvalues, `Disabled the \`${command}\` command, it might take some time to apply the settings.`, message.channel)
                
            }else if(action == 'on'){
                var guildQuery = {id: guildID};
                var newnewvalues = { $set: {[locate_string]:true}}
                client.updatedb(guildQuery, newnewvalues, `Enabled the \`${command}\` command, it might take some time to apply the settings.`, message.channel)
            }
        }
    }
    client.recache()
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
const { cpuUsage } = require("process");
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
    usage: "!settings [setting/list] [off/on]"
};
