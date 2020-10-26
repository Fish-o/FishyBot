const Discord = module.require('discord.js');

const request = require('request');
cachedRequest = require('cached-request')(request);
cacheDirectory = "/../../jsonFiles/cache/stats/";
cachedRequest.setCacheDirectory(__dirname + cacheDirectory);



function getPlayerStats(player, token, ttl= 10*60*1000) {
    return new Promise(function (resolve, reject) {

        let url = `https://ignitevr.gg/cgi-bin/EchoStats.cgi/get_player_stats?player_name=${player}&fuzzy_search=true`

        let options = {
            url: url,
            method: 'GET',
            ttl:ttl,
            json: true,
            headers: {
                "x-api-key":token,
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
        return message.channel.send('Please enter an Oculus username')
    }

    
    // Get data
    let player_stats = await getPlayerStats(args[0], client.config.igniteapi)

    // Return if nothing was found
    if(!player_stats.player[0]){
        return message.channel.send("Could not find user in the ignite database")
    }


    

    const user_stats = player_stats.player[0]
    const vrml_stats = player_stats.vrml_player
    const player_name = player_stats.player[0].player_name




    const attachment = new Discord.MessageAttachment(`${__dirname}/../../images/echo_disc.png`, 'sample.png');

    const Embed = new Discord.MessageEmbed()
    Embed.setAuthor("Powered by IgniteVR Metrics", 'https://ignitevr.gg/wp-content/uploads/2019/09/primary_Optimized.png', `https://ignitevr.gg/stats/player/${player_name}`);
    Embed.setColor('#0055ff')
    Embed.setTitle(`**${player_name}**'s echo stats`);
    Embed.attachFiles(attachment)
    Embed.setThumbnail('attachment://sample.png')
    Embed.addFields(
        { name: 'Games on record', value: user_stats.game_count},
		{ name: 'Level', value: user_stats.level, inline: true},
        { name: 'Goals Avg', value: Math.round(user_stats.total_goals / user_stats.game_count*100)/100, inline: true},
        { name: 'Assists Avg', value: Math.round(user_stats.total_assists / user_stats.game_count*100)/100, inline: true},
        { name: 'Saves Avg', value: Math.round(user_stats.total_saves / user_stats.game_count*100)/100, inline: true},
        { name: 'Stuns Avg', value: Math.round(user_stats.total_stuns / user_stats.game_count*100)/100, inline: true},
        { name: 'Wins', value: `${Math.round(user_stats.total_wins / user_stats.game_count * 100)}%`, inline: true},
    );
    /*Embed.addFields(
        {name: "", value: 
        
`Level: 
${user_stats.level}

Games on record:
${user_stats.game_count}

Goals Avg:
${Math.round(user_stats.total_goals / user_stats.game_count*100)/100}

Assists Avg:
${Math.round(user_stats.total_assists / user_stats.game_count*100)/100}

Saves Avg:
${Math.round(user_stats.total_saves / user_stats.game_count*100)/100}

Stuns Avg:
${Math.round(user_stats.total_stuns / user_stats.game_count*100)/100}

Win rate:
${Math.round(user_stats.total_wins / user_stats.game_count * 100)}%
 `
    
    }

    )*/
    console.log(vrml_stats)
    
    if(!Array.isArray(vrml_stats)){

        Embed.addFields(
            { name: 'Vrml', value: `${player_name} is part of ${vrml_stats.team_name}, type !echo ${vrml_stats.team_name}, or !echo ${player_name} to get more info`},
        );
    }

    message.channel.send(Embed)
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['ignite', 'statsecho', 'ignitestats', 'ignitevr'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"echostats",
    description: "Get a users echo stats",
    usage: "stats [player]"
};
