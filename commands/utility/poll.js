const ms = require("ms");
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
    if (!args[0]) return message.reply("You must have something to vote for!")
    //if (!message.content.includes("?")) return message.reply("Include a ? in your vote!")

    
    let time = ms(args[0]+ " "+ args[1]);
    if(time){
        args.shift();
        args.shift();
    } else{
        time = ms(args[0]);
        if(time){
            args.shift();
        } else{
            time = 5 *60*1000;
        }
    }
    
    
    if(!args[0])
        return message.channel.send("You must have something to vote for!");

    if(time > 3*60*60*1000){
        return message.channel.send(`The time given (${ms(time)}) exceeded the limit of 3 hours`)
    }


    message.channel.send(`:ballot_box: ${message.author} started a vote!`);
    const Embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(args.join(' '))
        .setDescription(`Started by: ${message.author.username}\nLength: ⏲️ ${ms(time, {long:true})} ⏲️`)
    const pollTopic = await message.channel.send(Embed);
    
    // Create a reaction collector
    const filter = (reaction) => reaction.emoji.name === '✅' || reaction.emoji.name === '⛔';
    const collector = pollTopic.createReactionCollector(filter, { time: time });
    await pollTopic.react(`✅`);
    await pollTopic.react(`⛔`);
    collector.on('collect', r => console.log(`Collected ${r.emoji.name}`));
    collector.on('end', collected => {    

        let users_for = collected.get('✅').users.cache.filter(user => user.id !== client.user.id)
        let users_against = collected.get('⛔').users.cache.filter(user => user.id !== client.user.id)

        if(users_for.size ==0){
            users_for = ['No one']
        }

        if(users_against.size ==0){
            users_against = ['No one']
        }

        const EndEmbed = new Discord.MessageEmbed()
            .setColor('#222299')
            .setTitle(args.join(' ')+' (ended)')
            .setDescription(`${message.author.username} started a vote!\nLength: ${ms(time, {long:true})} (ended)`)
            .addField(`✅ (${users_for.size || 0}):`,`
${users_for.map(user => {
    return user.toString()+"\n"
})}`, true)
            .addField(`⛔ (${users_against.size || 0}):`,` 
${users_against.map(user => {
    return user.toString()+"\n"
})}`, true);

    pollTopic.edit(EndEmbed)
    })
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'MANAGE_MESSAGES'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"poll",
    description: "Start a poll",
    usage: "f!poll (time) (text)"
};
