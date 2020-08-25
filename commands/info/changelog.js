exports.run = (client, message, args) => {
    message.channel.send(
`Version 1.3 release!
**New features:**
Auto commands:
    These are commands that will activate without a prefix! They can also have multiple names for them to activate. Right now the only one is Dad jokes


Settings:
    There is a new !settings command, that allowes admins to disable commands.


**Updated features:**

Spam:
    spam now sends a random amount of messages :p (it is in a range of 0 to 120 messages)

Stats:
    stats wont randomly crash the bot anymore

Db:
    When a user isnt in the data base, it get automaticly added if they send a command needing the user to be in the data base, making it crash less.
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
