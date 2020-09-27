const search = require('yt-search');

exports.run = async (client, message, args, ops) => {
    search(args.join(''), function(err, res){
        if(err){
            console.log(err)
            return message.channel.send("Something went wrong");
        }
        console.log(videos)
        let videos = res.videos.slice(0,20);
        console.log(videos)
        let resp = '';
        for(var i in videos){
            resp += `**[${parseInt(i)+1}]** \`${videos[i].title}\`\n`;
        }

        resp += `\nChoose a number between \`1-${videos.length}\``;
        message.channel.send(resp);

        const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0;

        const collector = message.channel.createMessageCollector(filter);

        collector.videos = videos;

        collector.once('collect', function(m){
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