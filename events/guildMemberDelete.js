const Discord = require('discord.js');


const  User = require('../database/schemas/User')
const  Guild = require('../database/schemas/Guild')

const MongoClient = require('mongodb').MongoClient;



exports.event = async (client, member) =>{
	

    const uri = client.config.dbpath;
	let current_member = member

    let guild = member.guild;
    var guildID = guild.id;

    let db_guild = await Guild.findOne({id: guildID});





    
    
    
    
    
    
    
    
    // Get guilds
    let value = db_guild;

    if(value.member_count_channel){
        let membercount_channel = guild.channels.cache.get(value.member_count_channel);
        if(membercount_channel){
            let membercount = guild.members.cache.filter(member => !member.user.bot).size -1;
            membercount_channel.setName(client.config.membercountcannelname+membercount)
        }
    }

    
}

exports.conf = {
    event: "guildMemberRemove"
};