

let uuid_cache = new Map();
const uuid_cooldown = 2 * 60 * 1000;

let hp_user_cache = new Map();
let hp_guild_cache = new Map();
const hp_cooldown = 60 * 1000;


const url_name_uuid = "https://api.mojang.com/users/profiles/minecraft/";

const Discord = require('discord.js');
const moment = require('moment')
const axios = require('axios');

function expToLevel(exp){
    const EXP_FIELD = "networkExp";
    const LVL_FIELD = "networkLevel";
    const BASE = 10000;
    const GROWTH = 2500;
    const HALF_GROWTH = 0.5 * GROWTH;
    const REVERSE_PQ_PREFIX = -(BASE - 0.5 * GROWTH) / GROWTH;
    const REVERSE_CONST = REVERSE_PQ_PREFIX * REVERSE_PQ_PREFIX;
    const GROWTH_DIVIDES_2 = 2 / GROWTH;

    return exp < 0 ? 1 : Math.floor(1 + REVERSE_PQ_PREFIX + Math.sqrt(REVERSE_CONST + GROWTH_DIVIDES_2 * exp));
}
exports.run = async(client, message, args) => {
    if(!args[0])
    return message.channel.send('Please enter a username to find')

    const api_key = process.env.HYPIXELTOKEN
    let user_name = args[0]
    if(uuid_cache.has(user_name)){
        if(uuid_cache.get(user_name).ts < Date.now() - uuid_cooldown){
            let mc_uuid = await axios.get(url_name_uuid+user_name)
        let jsondata = await mc_uuid.data
            uuid_cache.set(user_name, {ts: Date.now(), uuid:jsondata.id})
        }
    } else {
        let mc_uuid = await axios.get(url_name_uuid+user_name)
        if(mc_uuid.status == 204){
            uuid_cache.set(user_name, {ts: Date.now(), uuid:undefined})
        } else{
            let jsondata = await mc_uuid.data
            uuid_cache.set(user_name, {ts: Date.now(), uuid:jsondata.id})
    
        }
    }
    let uuid = uuid_cache.get(user_name).uuid
    
    if(!uuid){
        return message.channel.send('That Minecraft username is incorrect!')
    }
    message.channel.startTyping()

    if(hp_user_cache.has(uuid)){
        if(hp_user_cache.get(uuid).ts < Date.now() - hp_cooldown){
            let hp_response = await axios.get(`https://api.hypixel.net/player?uuid=${uuid}&key=${api_key}`);
            let hp_response_json = await hp_response.data
            hp_user_cache.set(uuid, {ts: Date.now(), data:hp_response_json})
        }
    } else{
        let hp_response = await axios.get(`https://api.hypixel.net/player?uuid=${uuid}&key=${api_key}`);
        let hp_response_json = await hp_response.data
        hp_user_cache.set(uuid, {ts: Date.now(), data:hp_response_json})
    }

    if(hp_user_cache.get(uuid).data.success !== true){
        message.channel.stopTyping()
        return message.channel.send('The user wasn\'t found')
    }
    
    let hp_user_data = hp_user_cache.get(uuid).data.player;

    
    if(hp_guild_cache.has(uuid)){
        if(hp_guild_cache.get(uuid).ts < Date.now() - hp_cooldown){
            let hp_response = await axios.get(`https://api.hypixel.net/guild?player=${uuid}&key=${api_key}`);
            let hp_response_json = await hp_response.data
            hp_guild_cache.set(uuid, {ts: Date.now(), data:hp_response_json})
        }
    } else{
        let hp_response = await axios.get(`https://api.hypixel.net/guild?player=${uuid}&key=${api_key}`);
        let hp_response_json = await hp_response.data
        hp_guild_cache.set(uuid, {ts: Date.now(), data:hp_response_json})
    }

    
    


    let Embed = new Discord.MessageEmbed()

    // Normal hypixel
    if(!args[1]){
            Embed.setThumbnail('https://crafatar.com/avatars/' + (hp_user_data.uuid || '') + '?size=100')
            .setTitle('Hypixel Player: ' + hp_user_data.displayname)
            .setURL('https://hypixel.net/player/' + hp_user_data.displayname + '/')
            .setColor('#30DB09')
            .addField('Rank', (hp_user_data.rank || hp_user_data.packageRank || hp_user_data.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
            .addField('Hypixel Level', expToLevel(hp_user_data.networkExp) || 'Not available', true)
            .addField('Karma', hp_user_data.karma || 'Not available', true)
            .addField('Client Version', hp_user_data.mcVersionRp || 'Not available', true)
            .addField('First Login', hp_user_data.firstLogin ? moment(hp_user_data.firstLogin).calendar() : 'Not available', true)
            .addField('Last Login', hp_user_data.lastLogin ? moment(hp_user_data.lastLogin).calendar() : 'Not available', true);
        
        let playerGuild;

        if(hp_guild_cache.get(uuid).data.success === true){
            playerGuild = hp_guild_cache.get(uuid).data.guild;
        }
        Embed.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + (playerGuild.tag||'no tag')  + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))
    } 
    
    // Bedwars
    else if(['bed', 'bedwar', 'bedwars'].includes(args[1].toLowerCase())){
        let bedwars_stats = hp_user_data.stats.Bedwars;
        if(!bedwars_stats){
            Embed.setTitle('This user never played Bedwars')
        } else {
            Embed.setThumbnail('https://crafatar.com/avatars/' + (hp_user_data.uuid || '') + '?size=100')
                .setTitle('Bedwars stats: ' + hp_user_data.displayname)
                .setURL('https://hypixel.net/player/' + hp_user_data.displayname + '/')
                .setColor('#d10600')
                .addField('Rank', (hp_user_data.rank || hp_user_data.packageRank || hp_user_data.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
                .addField('Games played', bedwars_stats.games_played_bedwars || 'Not available', true)
                .addField('Wins', bedwars_stats.wins_bedwars || 'Not available', true)
                .addField('Winstreak', bedwars_stats.winstreak || 'Not available', true)
                .addField('Beds broken', bedwars_stats.beds_broken_bedwars || 'Not available', true)
                
                .addField('Kills', bedwars_stats.kills_bedwars || 'Not available', true)
                .addField('Void kills', Math.round((bedwars_stats.void_kills_bedwars / bedwars_stats.kills_bedwars *100)) +'%'  || 'Not available', true)
                .addField('Final kills', bedwars_stats.final_kills_bedwars || 'Not available', true)
                .addField('Emeralds collected', bedwars_stats.emerald_resources_collected_bedwars || 'Not available', true)

            
            let playerGuild;

            if(hp_guild_cache.get(uuid).data.success === true){
                playerGuild = hp_guild_cache.get(uuid).data.guild;
            }
            Embed.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + (playerGuild.tag||'no tag')  + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))
        }
    }

    // Skywars
    else if(['sky', 'skywar', 'skywars'].includes(args[1].toLowerCase())){
        let skywars_stats = hp_user_data.stats.SkyWars;
        if(!skywars_stats){
            Embed.setTitle('This user never played Skywars')
        } else {
            Embed.setThumbnail('https://crafatar.com/avatars/' + (hp_user_data.uuid || '') + '?size=100')
                .setTitle('Skywars stats: ' + hp_user_data.displayname)
                .setURL('https://hypixel.net/player/' + hp_user_data.displayname + '/')
                .setColor('#147501')
                .addField('Rank', (hp_user_data.rank || hp_user_data.packageRank || hp_user_data.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
                .addField('Games played', skywars_stats.games_played_skywars || 'Not available', true)
                .addField('Wins', skywars_stats.wins || 'Not available', true)
                .addField('Winstreak', skywars_stats.win_streak || 'Not available', true)

                
                
                .addField('Kills', skywars_stats.kills || 'Not available', true)
                .addField('Void kills', Math.round((skywars_stats.void_kills / skywars_stats.kills *100)) +'%'  || 'Not available', true)

                .addField('Chests opened', skywars_stats.chests_opened || 'Not available', true)
                .addField('Arrows shot', skywars_stats.arrows_shot || 'Not available', true)
            
            let playerGuild;

            if(hp_guild_cache.get(uuid).data.success === true){
                playerGuild = hp_guild_cache.get(uuid).data.guild;
            }
            Embed.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + (playerGuild.tag||'no tag')  + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))
        }
    }

    else if(['parkour', 'parcour'].includes(args[1].toLowerCase())){
        let parkourStats = hp_user_data.parkourCompletions;
        if(!parkourStats){
            Embed.setTitle('This user never finished a parkour')
        } else {
            Embed.setThumbnail('https://crafatar.com/avatars/' + (hp_user_data.uuid || '') + '?size=100')
                .setTitle('Parkour stats: ' + hp_user_data.displayname)
                .setURL('https://hypixel.net/player/' + hp_user_data.displayname + '/')
                .setColor('#30bb63')
                .addField('Rank', (hp_user_data.rank || hp_user_data.packageRank || hp_user_data.newPackageRank || 'None').toString().replace(/_/g, ' '), true)
                .addField('Parkours completed',  Object.keys(parkourStats).length || 'Not available', true);
                
                Object.keys(parkourStats).forEach(parkour_name =>{
                    let time = 9999999;
                    parkourStats[parkour_name].forEach(Timing =>{
                        if(time > Timing.timeTook){
                            time= Timing.timeTook
                        }

                    })
                    let time_obj = moment.duration(time)
                    Embed.addField(parkour_name, `${time_obj.minutes()}:${time_obj.seconds()}:${time_obj.milliseconds()}`)
                })

            
            
            let playerGuild;

            if(hp_guild_cache.get(uuid).data.success === true){
                playerGuild = hp_guild_cache.get(uuid).data.guild;
            }
            Embed.addField('Guild', (playerGuild ? '[' + playerGuild.name + ' [' + (playerGuild.tag||'no tag')  + ']' + '](https://hypixel.net/guilds/' + playerGuild._id + '/)' : 'None'))
        }
    }

    message.channel.stopTyping();
    message.channel.send(Embed);
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
    name:"hypixel",
    description: `Get hypixel stats:
!hypixel (user name)
!hypixel (user name) bedwars/skywars/parkour`,
    usage: "hypixel"
};
