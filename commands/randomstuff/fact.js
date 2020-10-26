exports.run = (client, message, args) => {
    try{
    const Discord = require('discord.js');
    const request = require('request');
    
    
    let url = "https://uselessfacts.jsph.pl/random.json?language=en";

    let options = {json: true};



    request(url, options, (error, res, body) => {
        if (error) {
            return  console.log(error)
        };

        if (!error && res.statusCode == 200) {
            // do something with JSON, using the 'body' variable

            message.channel.send(body.text);
        };
    });
    }
    catch (err){
        console.log(err);
        message.channel.send("The command failed");
    }

};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['facts'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"fact",
    description: "Shows a random fact",
    usage: "fact"
};
        

    

