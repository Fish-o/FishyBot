
exports.run = (client, message, args) => {
    function myFunc() {
        message.author.send('spam')
    }
    var i =0;
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
    description: "Gives the info of the bot",
    usage: "!info"
};