# FishyBot
[Invite the bot!](https://discord.com/api/oauth2/authorize?client_id=721313666405761024&permissions=8&scope=bot)

[FishyBot website](https://fishman.live/)

A crappy discord bot


To run the bot yourself, you will need a .env file in the root of the project with in it:
```
TOKEN=your discord bot client token
DBPATH=the path to a mongodb database
```
To make use of all features, also add this:
```
wip
```

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


Events are strutured like this:
```js
exports.event = (client, event specific args) =>
	// Code that should be run on the event
};


exports.conf = {
    event: "event name" // https://discord.js.org/#/docs/main/stable/typedef/WSEventType
};

```
