exports.run = async (client, message, args, ops) => {
    let fetched = ops.active.get(message.guild.id);
    
    if(!fetched)
        return message.channel.send("There isn't any music playing in this guild!");

    if(!message.member.voice.channel)
        return message.channel.send("You are not in a voice channel");          

    if(!fetched.dispatcher.paused)
        return message.channel.send("The music isn't paused");
        
    fetched.dispatcher.resume();    
    

    const Embed = new Discord.MessageEmbed()
    .setColor('#00ff00')
    .setTitle('Successfully resumed the track')
    .setDescription(`${fetched.queue[0].songTitle}`)
    .setTimestamp()
    .setAuthor(message.author.id, message.author.displayAvatarURL());
    message.channel.send(Embed);

    //message.channel.send(`Successfully resumed the track **${fetched.queue[0].songTitle}**`);    
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['unpause'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"resume",
    description: "Resumes paused music",
    usage: "!resume"
};