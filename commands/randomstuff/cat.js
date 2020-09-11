const Discord = require('discord.js');
const querystring = require('query-string');
const CAT_API_URL = "https://api.thecatapi.com/";
const r2 = require("r2");
exports.run = async (client, message, args) => {
    
    const CAT_API_KEY = client.config.CAT_TOKEN


    var headers = {
        'X-API-KEY': CAT_API_KEY,
    }
    var query_params = {
        //'has_breeds':true,
        'mime_types':'jpg,png',
        'size':'med',  
        'sub_id': message.author.username, 
        'limit' : 1
    }

    let queryString = querystring.stringify(query_params);

    try { 
    let _url = CAT_API_URL + `v1/images/search?${queryString}`;
    var response = await r2.get(_url , {headers} ).json
    } catch (e) {
        console.log(e)
        return message.channel.send("An error has occured")
    }

    const images = response;
    const image = images[0];

        

    const embed = new Discord.MessageEmbed()
    .setColor("#15f153")
    .setDescription(`Oh look i found a cat :cat:`)
    .setImage(image.url);

    message.channel.send(embed);    
    

    
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