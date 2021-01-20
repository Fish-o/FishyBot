const Discord = require('discord.js');
const axios = require('axios');
//const Ssentry = require("@sentry/node");
const Ttracing = require("@sentry/tracing");

let command = async function(){
    return new Promise(async (resolve, reject)=>{
        try{
        let errEmbed = new Discord.MessageEmbed()
            .setTitle('Fact command failed')
            .setColor('RED')
            .setTimestamp();
        let url = "https://uselessfacts.jsph.pl/random.json?language=en";
        


        let res = await axios.get(url)
        if (res.status == 200) {
            // do something with JSON, using the 'body' variable
             
            resolve(res.data.text);
            return;
        }else{
            let embed = errEmbed.setDescription('Invalid status code: '+res.status)
            resolve(embed);
            return;
        };
        
        }
        catch (err){
            console.log(err);
            let embed = errEmbed.setDescription('Reason: '+err)
            resolve(embed);
            return;
        }
    })
};
exports.command = command;
exports.run = async (client, message, args) => {
    return message.channel.send(await command())
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['facts'],
    perms: [
        
    ]
  };
  
const { WSASERVICE_NOT_FOUND } = require('constants');
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"fact",
    description: "Shows a random fact",
    usage: "fact"
};
        

    

