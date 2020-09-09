const Discord = require('discord.js');

const CAT_API_URL = "https://api.thecatapi.com/"

exports.run = (client, message, args) =>{
    
    const CAT_API_TOKEN = client.config.CAT_TOKEN

    const options = {
        url: CAT_API_URL,
        headers: {
            'X-API-KEY': CAT_API_TOKEN
        }
      };
      
      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          const info = JSON.parse(body);
          console.log(info.stargazers_count + " Stars");
          console.log(info.forks_count + " Forks");
        }
      }
      
    .then(url => {
        const embed = new Discord.MessageEmbed()
        .setColor("#15f153")
        .setDescription(`Oh look i found a cat :cat:`)
        .setImage(url);

        message.channel.send(embed);    
    })

    
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['cats','kitten','kitty'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"cat",
    description: "Shows a catto",
    usage: "!cat"
};