
exports.run = (client, message, args) => {
    function myFunc() {
        message.author.send('spam')
    }

    var i =0;
    const m = 50;
    const s = 50;

    const msges =  m + 2.0 * s * (Math.random() + Math.random() + Math.random() - 1.5);
    let cosnt =Math.max(5, Math.round(msges))

    message.channel.send(`${rounded} messages comming up!`)
    for(i = 0; i < 60; i++){
        setTimeout(myFunc, 1010*i);
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
    name:"spam",
    description: "Sends a random amount of messages to the user who called it in dm's",
    usage: "!spam"
};