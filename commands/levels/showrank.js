const Discord = require('discord.js');
var Canvas = require('canvas');

async function GetAvatar(client, message, ctx) {
    //I HATE this part. I think here at the Yukiko Dev Team Incorporation ltd llc Group we all hate this part.
    // If Anyone know how to use canvas and this part better than us, please feel free to PR :) 
    // (or if you are a dev of node-canvas please contact me on Twitter/Github @Asthriona )

    //Avatar function
    //get user in the database.
    client.dbgetuser(client, message.guild.id, message.author.id).then(users=>{
        //XP bar calculus. (Help)
        let nxtlvl = 300 * Math.pow(2, users.level);
        var n = ((users.xp - nxtlvl) / nxtlvl) * -100;
        var member = client.getMember(message);
        var arc = (100-n)/100*Math.PI;
        //Image arc draw (Cry in js)
        ctx.strokeStyle = member.displayHexColor;
        ctx.beginPath();
        ctx.lineWidth = 15;
        ctx.arc(125, 140, 102, Math.PI*1.5,arc);
        ctx.stroke();
    })
    //lvlbar background
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.beginPath();
            ctx.lineWidth = 20;
            ctx.arc(125, 140, 102, 0,Math.PI * 2);
            ctx.stroke();
    //Print the profile picture.
    var avatar = await Canvas.loadImage(message.author.displayAvatarURL);
    ctx.beginPath();
    ctx.arc(125, 140, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 40, 200, 200);
}

exports.run = async (client, message, args) => {
    message.channel.startTyping();
    var member = client.getMember(message, args.join(" "));

    var canvas = Canvas.createCanvas(934, 282);
    var ctx = canvas.getContext('2d');


    let users = await client.dbgetuser(client, message.guild.id, member.id)
    
    //ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //Draw rectangle
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(260, 80, 650, 160);
    ctx.closePath();
    ctx.stroke();
    //Get Username
    //ctx.font = '60px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(member.displayName, 280, 136);
    //Show XP and levels
    let nxtlvl = 300 * Math.pow(2, users.level);
    //ctx.font = '40px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("You are level " + users.level + " - " + users.xp + " XP", 280, 180);
    //xp left
    var xpLeft = nxtlvl - users.xp;
    //ctx.font = '50px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText(`next level in ${xpLeft} XP`, 280, 225);
    //Get avatar
    await GetAvatar(client, message, ctx);
    //Put all the things together and send it in a nice package.
    var lvlimg = new discord.Attachment(canvas.toBuffer(), 'rank-cards.png');
    message.reply(lvlimg)

    /*const constant = 0.5; 

    let level = Math.floor(constant * Math.sqrt(user.xp))

    let xp_for_curlvl = Math.floor(Math.pow(level * constant,2));
    let xp_for_nextlvl = Math.floor(Math.pow(level+1 * constant,2));
    let diff = xp_for_nextlvl-xp_for_curlvl;

    const embed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${message.author.name}'s stats`)
    .addField('Level', level)
    .addField('Xp', user.xp)
    .addField('Xp for this lvl', xp_for_curlvl)
    .addField('Xp for next', xp_for_nextlvl)
    .addField('Xp till nex', diff)
    .setTimestamp();


    message.channel.send(embed);*/
    message.channel.stopTyping();
    
    
    
    
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['xp','showrank','showxp'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"rank",
    description: "Shows the rank and xp of a given user",
    usage: "!rank (user)"
};
