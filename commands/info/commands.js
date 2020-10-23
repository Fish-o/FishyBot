const Discord = require('discord.js');
const fs = require('fs');


exports.run = (client, message, args) => {
	if (!args[0]) {
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
        



        let cats = {};

        let index_string = 
`[0]: Index
[Index][0]`
        let commands_string = ``;

        client.commands.forEach(c=>{if(c.help.category != 'debug'){cats[c.help.category] = [];}})


        client.commands.forEach(c=>{
            //console.log(c.help.category)
            if(c.help.category != 'debug'){
                cats[c.help.category].push({name:c.help.name,
                                            desc:c.help.description,
                                            usage:c.help.usage})
            }
        })
        cats=sortOnKeys(cats)


        Object.keys(cats).forEach(catname =>{
            cats[catname].sort()

            const index = Object.keys(cats).findIndex(key => key == catname)+1

            index_string = index_string.concat('\n',`[${catname}][${index}]`)

            let cat_string = `\n\n[${index}]: ${catname}`;

            cats[catname].forEach(command => {
                let command_string= 
                `\n${command.usage}`//\n> ${command.desc.split('\n').join('\n> ')}`
                cat_string = cat_string.concat(command_string)

            })

            commands_string = commands_string.concat(cat_string)
        })

        commands_string


		message.channel.send(`[FishyBot](https://discord.com/users/325893549071663104/)\n\n${index_string} ${commands_string}`, {code: "markdown"});
	} else {
	  let command = args[0];
	  if(client.commands.has(command)) {
		command = client.commands.get(command);
		message.channel.send(`= ${command.help.name} = \n${command.help.description}\nusage:: ${command.help.usage}`, {code: "asciidoc"});
	  }
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
    name:"commands",
    description: "Shows a list of all commands",
	usage: "!commands"
};