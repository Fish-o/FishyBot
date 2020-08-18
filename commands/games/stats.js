const Discord = module.require('discord.js');

const request = require('request');
cachedRequest = require('cached-request')(request);
cacheDirectory = "/../../jsonFiles/cache/stats/";
cachedRequest.setCacheDirectory(__dirname + cacheDirectory);



function getPlayerStats(player, ttl= 10*60*1000) {
    return new Promise(function (resolve, reject) {

        let url = `https://ignitevr.gg/cgi-bin/EchoStats.cgi/get_player_stats?player_name=${player}&fuzzy_search=true`

        let options = {
            url: url,
            method: 'GET',
            ttl:ttl,
            json: true,
            headers: {
                "x-api-key":process.env.igniteapi,
                'User-Agent': 'FishyBot'
            }
        };

        cachedRequest(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}



exports.run = async (client, message, args) => {
    if(!args[0]){
        return message.channel.send('Please enter a oculus username')
    }

    let player_stats = await getPlayerStats(args[0])
    console.log(player_stats)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['echo', 'ignite'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"stats",
    description: "Get a users echo stats",
    usage: "!stats [player]"
};
