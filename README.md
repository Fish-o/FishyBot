# FishyBot
[Invite the bot!](https://discord.com/api/oauth2/authorize?client_id=721313666405761024&permissions=8&scope=bot)

A crappy discord bot

A basic command example:
```js
exports.run = (client, message, args) => { 	// The args are formed like this:
	// args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	// And then args.shift()
	
	message.channel.send(`pong = \`${client.ws.ping} ms\``).catch(console.error);
}

  

exports.conf = {
	enabled:  true, 	// Does nothing rn
	guildOnly:  false, 	// Does nothing rn
	aliases: [], 		// Alliasses for commands
	perms: [ 		// Permisions users need to use the command
	]	// https://anidiots.guide/understanding/roles#addendum-permission-names
};

const  path = require("path")
exports.help = {
	category:  __dirname.split(path.sep).pop(), 	// The category name, this returns the 
							// name of the dir it is in
	name:"ping",					// The default command  name
	description:  "Returns the ping of the bot",
							// Detailed description on what 
							//the command does
	
	usage:  "!ping"					// Simple guide on how to use 
							//the command
};
```
