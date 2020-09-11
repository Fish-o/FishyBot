exports.run = (client, message, args) => {
    message.channel.send(
`Version 1.4 release!
**New features:**
Auto commands:
    These are commands that will activate without a prefix! They can also have multiple names for them to activate. Right now the only one is Dad jokes





**Updated features:**

Settings:
    There is a new !settings command, that allowes admins to disable commands.


`
        ).catch(console.error);
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
    name:"changelog",
    description: "View the changelogs!",
    usage: "!changelog"
};
