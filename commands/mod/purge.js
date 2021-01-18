let Discord  = require('discord.js') 
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

exports.run = async (client, message, args) =>{
    const deleteCount = parseInt(args[0], 10) + 1;
        
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100){
        return message.channel.send(message.error("Please provide a number between 1 and 99 for the number of messages to delete"));
    }

    await message.channel.bulkDelete(deleteCount).catch(error => message.reply(`Couldn't delete messages because of: ${error}`))  
}

exports.interaction = async(client, interaction, args)=>{
    const deleteCount = parseInt(args[0].value, 10) + 1;
        
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100){
        console.log('not good number')
        interaction.send(interaction.error("Please provide a number between 1 and 99 for the number of messages to delete"));
        return 
    }
    console.log('gonna delete da shiz')
    try{
        await interaction.channel.bulkDelete(deleteCount)
        console.log('send response')
        let r = await interaction.send(new Discord.MessageEmbed().setTitle(`Deleted ${deleteCount-1} messages`).setColor('GREEN').setDescription('By: '+interaction.member.toString()))
        interaction.delResponse(1000)
        console.log(r)
        console.log(JSON.stringify(r))
    }
    catch(error){
        Sentry.captureException(error);
        interaction.send(await interaction.error(`Couldn't delete messages`,error))
        
    }

    
}


exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        options:[
            {
                name: "amount",
                description: "The amount of messages to delete",
                required:true,
                type: 4,
            }
        ]
    },
    aliases: ['delete'],
    perms: [
        'MANAGE_MESSAGES'
  ]
};

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name: "purge",
  description: "Delete an amount of messages",
  usage: "purge [number]"
};