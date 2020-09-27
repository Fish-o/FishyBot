const search = require('yt-search');
const Discord = require('discord.js')
exports.run = async (client, message, args, ops) => {
    search(args.join(''), function(err, res){
        if(err){
            console.log(err)
            return message.channel.send("Something went wrong");
        }
        let videos = res.videos.slice(0,21);

        const Embed = new Discord.MessageEmbed()
        .setColor('#001166')
        .setTitle('Choose a number between \`1-${videos.length}\`, or type \`cancel\`')
        .setTimestamp()
        .setAuthor(message.author.id, message.author.displayAvatarURL());

        let resp = '';
        for(var i in videos){
            resp += `**[${parseInt(i)+1}]** \`${videos[i].title}\`\n`;
        }

        resp += `\nChoose a number between \`1-${videos.length}\``;
        Embed.setDescription(resp);
        message.channel.send(Embed);

        const filter = m => (!isNaN(m.content) && m.content < videos.length+1 && m.content > 0) || m.content.toLowerCase() == 'cancel';

        const collector = message.channel.createMessageCollector(filter);

        collector.videos = videos;

        collector.once('collect', function(m){
            if(m.content.toLowerCase() == 'cancel'){
                return message.channel.send('Canceld')
            }
            
            let commandFile = require ("./playtube.js");
            commandFile.run(client, message, [this.videos[parseInt(m.content)-1].url], ops);
        });

    });
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['search'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"ytsearch",
    description: "Search on youtubefor a song",
    usage: "!ytsearch (query)"
};