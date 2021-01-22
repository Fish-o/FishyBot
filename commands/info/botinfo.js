const Discord = require('discord.js');

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}


exports.run = (client, message, args) =>{
    let servers = client.guilds.cache.size;
    let users = client.users.cache.size;
    
    let days = 0;
    let week = 0;
    let uptime = ``;
    /*let totalSeconds = (client.uptime / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    
    
    if(hours > 23){
        days = days + 1;
        hours = 0;
    }

    if(days == 7){
        days = 0;
        week = week + 1;
    }

    if(week > 0){
        uptime += `${week} week, `;
    }

    if(minutes > 60){
        minutes = 0;
    }

    uptime += `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;*/
    var time = process.uptime();
    uptime = (time + "").toHHMMSS();

    let serverembed = new Discord.MessageEmbed()
        .setColor("#9400D3")
        .setAuthor(client.config.author, client.user.displayAvatarURL)
        .addField(`Version`,client.config.version, true)
        //.addField(`Library`,`Discord.js` , true)
        .addField(`Creator`,`Fish`, true)
        .addField(`Servers`, `${servers}`, true)
        .addField(`Users`, `${users}`, true)
        .addField(`Invite`, `[Check the FishyBot website!](https://fishman.live/)`, true)
        .setFooter(`Uptime: ${uptime}`);

    return message.channel.send(serverembed);    

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['infobot','fishybotinfo'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"botinfo",
    description: "Gives the info of the bot",
    usage: "botinfo"
};