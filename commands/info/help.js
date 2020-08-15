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


	/*
    const command = message.content.split(' '); 

    if(command[1] == undefined){
		fs.readFile(__dirname + '/../../jsonFiles/commands.json', (err, dataJson) => {
			if (err) throw err;
			let commands_data = JSON.parse(dataJson);
			
			const embed = new Discord.MessageEmbed()
                embed.setColor("#0000ff");
                embed.setTitle('This is the help page for The Fishy Bot!');
                embed.setThumbnail(client.user.avatarURL());
            message.author.send(embed);  	

			var groups = []
			
			for(command_name in commands_data){
				if(groups.includes(commands_data[command_name]["group"]) === false){
					groups.push(commands_data[command_name]["group"]);
				}
			}
			
			
			for(group in groups){
				var commands_in_group = []
				for(command_name in commands_data){
					if(commands_data[command_name]["group"] == groups[group]){
						commands_in_group.push(commands_data[command_name]);
					}
				}
				commands_in_group.sort()
				
				try{

					const embed = new Discord.MessageEmbed()
					embed.setColor("#ff0000");
					embed.setTitle(groups[group]);

					for(command_info in commands_in_group){
						embed.addField(commands_in_group[command_info]['name'], "Description: " + commands_in_group[command_info]['desc'] + '\n Example: ' + commands_in_group[command_info]['example']);

					}

					message.author.send(embed);
				}
				catch(error){
					message.channel.send("The command failed because: "+ error);
				}
			
			}
		});
    }

    else if(command[1] != undefined){ 
        fs.readFile(__dirname + '/../../jsonFiles/commands.json', (err, dataJson) => {  
        	

            if (err) throw err;
            let helpMe = JSON.parse(dataJson);
            let commandName = command[1];

            try{
                const embed = new Discord.MessageEmbed()
                    .setColor("#FF4500")
                    .addField(`Command: $${helpMe[commandName].name}`,`Group: ${helpMe[commandName].group}\n`+`Desc: ${helpMe[commandName].desc}\n`+`Usage: ${helpMe[commandName].usage}\n`+`Example: ${helpMe[commandName].example}\n`);
                message.channel.send(embed);    
            }
            catch(error){
                message.channel.send("I could not find that command!");
            }
        });
    }*/
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
	usage: "!help (command)"
};