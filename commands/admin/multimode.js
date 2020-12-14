exports.run = async (client, message, args, guild_cache) => {
    if(!args[0]){
        return message.channel.send('Please enter commands to run')
    }
    
    let whole_msg = message.content.slice(message.content.split(args[0])[0].length)
    let commands = whole_msg.split(/\n|\|/g)
    if(!commands[0]){
        return message.channel.send('No commands found in the message')
    }

    //let guild_cache = await client.getDbGuild(message.guild.id)
    if(!guild_cache){
        return message.channel.send('Cache not found')
    }
    commands.forEach(command_txt => {
        args = command_txt.trim().split(/ +/g);
        command = args.shift().toLowerCase();


        if (!command) message.channel.send(`❗ Something went wrong with the text (No command name found): \`${command_txt}\`\nproceeding to run the other commands`);
        if(!client.allow_test(command, guild_cache)){return}

        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            command =  client.aliases.get(command)
            cmd = client.commands.get(command);
        }
        if(command == "multiplecmds"){
            return message.channel.send('It is not allowed to run this command from within this command')
        }
        if (!cmd) return message.channel.send(`❗ Something went wrong with the text (command is not valid): \`${command_txt}\`\nproceeding to run the other commands`);

        if(client.config.features.includes(cmd.help.category) && !guild_cache.features.includes(cmd.help.category) && !guild_cache.features.includes('all')){
            return message.channel.send(`❗ Something went wrong with the text (Premium feature): \`${command_txt}\`\nproceeding to run the other commands`)
        };

        let newmessage = message;
        newmessage.content = command_txt;
        cmd.run(client, message, args, guild_cache);
    });

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['multiplecmd', 'multiplecommands', 'multcmd', 'multcmds'],
    perms: [
        "ADMINISTRATOR"
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"multiplecmds",
    description: "Allows an admin to run lots of commands at the same time. To seperate the commands use either | or an enter. You do not need to enter a prefix for the commands.",
    usage: "multiplecmds (cmd+args)\n(cmd+args) etc"
};
