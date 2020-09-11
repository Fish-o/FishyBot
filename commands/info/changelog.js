exports.run = (client, message, args) => {
    message.channel.send(
`Version 1.4 release!
**New features:**
!CAT
    they will consume us all, there is no delaying the inevitable

!log
    Logs events to a specified channel, currently doesnt log that much (you can check with !help log) but there will be added more soon!

!onward
    You are now able to view an onward vrml team's stats!


**Updated features:**
Settings:
    Made !settings able to disable everything!

Renames:
    stats => echostats
    vrml => echo

**Other stuff**
fixed the bot readding a db entry, after rejoining
fixed guild delete
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
