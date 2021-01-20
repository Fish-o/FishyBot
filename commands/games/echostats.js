const Discord = module.require('discord.js');

const axios = require('axios');
const  User = require('../../database/schemas/User')

let cache = {}
let refresh_time = 30*60*1000
//const Ssentry = require("@sentry/node");
//const Ttracing = require("@sentry/tracing");
function getPlayerStats(player, token) {
    return new Promise(async function (resolve, reject) {
        try{
            if(!cache[player] || cache[player].timestamp+refresh_time <= Date.now()){
                let url = `https://ignitevr.gg/cgi-bin/EchoStats.cgi/get_player_stats?player_name=${player}&fuzzy_search=true`
                let headers = {
                    "x-api-key":token,
                    'User-Agent': 'FishyBot'
                }
                
                let r2 = await axios.get(
                    url,
                    {headers}
                )
                resolve(r2.data)
                cache[player] = r2.data
                cache[player].timestamp = Date.now()
            } else {
                resolve(cache[player])
            }

        }
        catch{
            resolve(undefined)
        }
    });
}


let getEchoStats = async function (client, args, memberId, channel){
    return new Promise( async(resolve,reject) => {
        if(!args[0] && !memberId){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Please enter an Echo username`).setTimestamp());
            return
        }
        let name = args[0]
        if(memberId){
            let member = channel.guild.members.cache.get(memberId);
            if(!member){
                resolve(new Discord.MessageEmbed().setColor('RED').setTitle("Could not find member in server").setTimestamp())
                return
            }
            let [dbUser, dbGuild] = await Promise.all([
                client.getDbUser(member.user),
                client.getDbGuild(channel.guild.id)
            ])
            if((!dbUser ||  !dbUser.usernames || !dbUser.usernames.Oculus) && (!dbGuild || !dbGuild.usernames.has(memberId) || !dbGuild.usernames.get(memberId).Oculus)){
                resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Member "${member.user.tag}" has no Oculus name set`).setDescription(`You can either set a global or a server specific username.\n**Global**: run \`${client.config.prefix}friendme\` in a dm chat with _${client.user.tag}_\n**Server specific**: run \`${client.config.prefix}friendme\` in the server you want to set your Oculus username`).setTimestamp())
                return;
            } 
            if(!(!dbGuild || !dbGuild.usernames.has(memberId) || !dbGuild.usernames.get(memberId).Oculus)){
                name = dbGuild.usernames.get(memberId).Oculus.split()
            }
            else if (!(!dbUser ||  !dbUser.usernames || !dbUser.usernames.Oculus)){
                name = dbUser.usernames.Oculus.split()
            }
        }
        
        // Get data
        let player_stats = await getPlayerStats(name, client.config.igniteapi)
        // Return if nothing was found
        if(!player_stats.player || !player_stats.player[0]){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle("Could not find user in the ignite database").setTimestamp());
            return
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

        console.log('Made mebed')
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
        
        if(!Array.isArray(vrml_stats)){

            Embed.addFields(
                { name: 'Vrml', value: `${player_name} is part of ${vrml_stats.team_name}, type !echo ${vrml_stats.team_name}, or !echo ${player_name} to get more info`},
            );
        }

        resolve(Embed);
        return;
    });
    
}
exports.run = async (client, message, args) => {
    message.channel.startTyping()
    let memberid;
    if(message.mentions.members.first()){
        memberid = message.mentions.members.first().id;
    }
    try{
        let Embed = await getEchoStats(client, args, memberid, message.channel);
        return message.channel.send(Embed)
        
    }catch(err){
        //Sentry.captureException(err);
    }finally{
        message.channel.stopTyping()
    }
        
    
}

exports.interaction = async(client, interaction, args) => {
    interaction.channel.startTyping();
    try{
        const memberIdMatch = args[0].value.match(/<@.(\d{18})>/)
        let memberId;
        if(memberIdMatch){
            memberId = memberIdMatch[1]
        }
        
        let embed = await getEchoStats(client, args[0].value.split(), memberId, interaction.channel);
        interaction.send(embed)
    }
    catch(err){
        //Sentry.captureException(err);
        console.log(err)
        client.sendInfo(`ERROR: echostats interaction (${Date.now()})`)
        interaction.channel.send('Something has gone wrong with the echo stats command')
    } finally{
        interaction.channel.stopTyping()
    }
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    interaction: {
        options: [
            {
                name: "Name",
                description: "A users Oculus name",
                required: true,
                type: 3
            }
        ]
    },
    aliases: ['ignite', 'statsecho', 'ignitestats', 'ignitevr'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"echostats",
    description: "Gets a persons echo ignite stats",
    usage: "echostats [player]"
};
