
const superagent = require('superagent');
const Discord = module.require('discord.js');
exports.run = async (client, message, args) => {
    let replies = ['Run!', 'RUN!', 'Lay on the ground, it will think you are dead.','Hide the children!','SHOOT IT','this is where it will all end...','There is no point in running','you cannot escape the might of the goose','it wants to eat you','look at those devilish eyes','turn around an run','grab it by the neck and shake it', 'kill it before it lays eggs', 'kill it!','murder it!','SHOOT IT','call the military','CALL THA NAVY', 'CALL THE POLICE', 'Call an ambulance'];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/goose")
    const embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTitle(reply)
    .setImage(body.url)
    message.channel.send({embed})
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['geese'],
    perms: [
        
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"goose",
    description: "IT IS COMMING FOR YOU, RUN",
    usage: "goose"
};
