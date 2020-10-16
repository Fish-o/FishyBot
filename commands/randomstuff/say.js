var Filter = require('bad-words'),
    filter = new Filter();
 


exports.run = (client, message, args) => {
    //message.channel.send('').catch(console.error);
	// makes the bot say something and delete the message. As an example, it's open to anyone to use. 
	// To get the "message" itself we join the `args` back into a string with spaces: 

	let sayMessage = args.join(" ");
	if (sayMessage.includes('@everyone') && !message.member.hasPermission("ADMINISTRATOR")){
		sayMessage = sayMessage.replace('@everyone', 'everyone');
	};
	if (sayMessage.includes('@here') && !message.member.hasPermission("ADMINISTRATOR")){
		sayMessage = sayMessage.replace('@here', 'here');
	};
	if (sayMessage.includes('@') && !message.member.hasPermission("ADMINISTRATOR")){
		sayMessage = sayMessage.replace('@', ' ');
    };
    



	//if(profanity.check(sayMessage).length >= 1) {return message.channel.send('bad words');}
	
	if(filter.clean(sayMessage) != sayMessage){
		message.delete().catch(O_o=>{}); 
		message.channel.send(message.author.tag + ' - ' + filter.clean(sayMessage));
	}
	else {
	// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
	message.delete().catch(O_o=>{}); 
	// And we get the bot to say the thing: 
	message.channel.send(sayMessage);
    }
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['tell','speak','talk'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"say",
    description: "Lets the bot say a message in chat",
    usage: "!say [text]"
};
