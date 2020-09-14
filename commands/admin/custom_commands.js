/*


custom commands


input
	!asdf
	asdf
	i like asdf and also fdsa!
	regex


argumenten
	user mentions
	woord after it



output
	["Love meter between {user} & {mention} {w3} {r1|100}"]



*/


exports.run = (client, message, args) => {
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['customcommands', 'custom_commands'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"custom",
    description: 
`
**NOT DONE YET!!!**

Allows you to make a custome command with multiple responses.

List all custom commands:
!custom list

List all responses to a custom command:
!custom list (command name/index)

Make new and delete commands
!custom new (command name)
!custom delete (command name/index)

Add and remove responses to a command
!custom add (command name/index) (resoponse index)
!custom remove (command name/index) (response index)


Use the \`list\` options to obtain the indexes

`,
    usage: "View `!help custom` for info"
};
