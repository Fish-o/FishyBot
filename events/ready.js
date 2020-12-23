const path = require("path");
const Guild = require('../database/schemas/Guild');
const axios = require('axios');
const Discord = require('discord.js')

exports.event = async (client) => {

    let commands = [
        {
            name: "help",
            description: "Shows the help page for FishyBot",
            options: [
                {
                    name: "Command",
                    description: "Show help for a specific command",
                    required: false,
                    type: 3
                }
            ]
        },
        {
            name: "echovrml",
            description: "Gets a teams echo vrml stats",
            options: [
                {
                    name: "Team",
                    description: "An Echo Vrml team's name",
                    required: true,
                    type: 3
                }
            ]
        },
        {
            name: "echostats",
            description: "Gets a persons echo ignite stats",
            options: [
                {
                    name: "Name",
                    description: "A users Oculus name",
                    required: true,
                    type: 3
                }
            ]
        }
    ]



    let headers= {
        "Authorization": `Bot ${client.config.token}`
    }
    let url =  `https://discord.com/api/v8/applications/${client.user.id}/commands`

    commands.forEach(async (data) => {
        await axios.post(
            url, 
            data,
            {headers}
        )
    })
    

    let r2 = await axios.get(
        url,
        {headers}
    )

    console.log(r2.data)
    console.log(JSON.stringify(r2.data))



    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;
        
        if (command === 'help'){
            if(interaction.data.options){
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds:[await client.helpFunc(client, [interaction.data.options[0].value]) || new Discord.MessageEmbed().setColor('RED').setTitle(`No help page found for "${interaction.data.options[0].value}"`)]
                        }
                    }
                })
            } else{
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds:[await client.helpFunc(client, [])]
                        }
                    }
                });
            }
        } else if (command === 'echovrml'){
            if(interaction.data.options){
                
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds:[await require("./../commands/games/echovrml.js").getVrmlStats(client, interaction.data.options[0].value.split())]
                        }
                    }
                })
            }
        } else if (command === 'echostats'){
            if(interaction.data.options){
                client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds:[await require("./../commands/games/echostats.js").getEchoStats(client, interaction.data.options[0].value.split())]
                        }
                    }
                })
            }
        } 
    });




    


    
    client.recache(client)
    client.sendinfo('Bot gone online')
	console.log('I am ready to serve you!');
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
