
const MongoClient = require('mongodb').MongoClient;
const  User = require('../database/schemas/User')
const  Guild = require('../database/schemas/Guild')


exports.event = async (client, guild) => {
    client.sendinfo('event: guild create')
    console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot. Owner: ${guild.owner.user.tag} (${guild.owner.user.id})`);

	var guildID = guild.id;

    guild.members.fetch().then((member_list) => {
        let memberidlist = []

        member_list.forEach(member=>{
            memberidlist.append(member.id)
            await User.findOneAndUpdate({discordId:guild_member.id },{
                id:guildID, 
                discordTag:guild_member.user.tag,
                avatar:guild_member.user.avatar
            }, { upsert: true, setDefaultsOnInsert: true })
        })

        /*const id = guildID;
        const name = guild.name
        const icon = guild.icon
        const ownerid = guild.ownerid
        const features = guild.features
        const permissions_new = guild.roles.everyone.permissions.ALL
        member_list.forEach(guild_member => {
            
            let permissions = guild_member.Permissions().ALL;
            let owner = ownerid === guild_member.id
            let member_guild_object = {
                id,
                name,
                icon,
                owner:owner,
                permissions,
                features,
                permissions_new
            }
            
            let new_user = await User.findOneAndUpdate({discordId:guild_member.id },{
                    id:guildID, 
                    discordTag:guild_member.user.tag,
                    avatar:guild_member.user.avatar//,
                   // guilds: {}
                }, { upsert: true, new: true, setDefaultsOnInsert: true })

            if(!new_user.guilds.find(new_guild => new_guild.id == guild.id)){
                User.updateOne({discordId: guild_member.id})
            }
        })*/

        let result = await Guild.findOneAndUpdate({id:guildID }, {id:guildID, memberlist:memberidlist}, { upsert: true, new: true, setDefaultsOnInsert: true })
    })
            
    console.log(guild.name)
};


exports.conf = {
    event: "guildCreate"
};