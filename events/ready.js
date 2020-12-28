const path = require("path");
const Guild = require('../database/schemas/Guild');
const axios = require('axios');
const Discord = require('discord.js')






exports.event = async (client) => {
    console.log('\nREADY!\n')


    
    client.recache(client)
    client.sendinfo('Bot gone online')
    console.log('Interections loaded:\n'+client.setInteractions.join('\n'))
    client.user.setStatus('online');
    



    setInterval(async () =>{
        let db_guilds = await Guild.find(); 
        let member_count_guilds = db_guilds.filter(db_guild => !isNaN(db_guild.member_count_channel))
        member_count_guilds.forEach(async (member_count_db) => {
            let channel = client.channels.cache.get(member_count_db.member_count_channel);
            
            if(channel && channel.type == 'text'){
                await channel.fetch();
                let membercount = channel.guild.members.cache.filter(member => !member.user.bot).size;
                console.log(channel.guild.members.cache.filter(member => !member.user.bot))
                console.log(membercount)
                channel.setName(`members ${membercount}`)
            }

        });
    },60*60*1000);
    
    //client.user.setActivity('New Update!');

    
    
};


exports.conf = {
    event: "ready"
};



