exports.event = async (client, message) =>{
    // Getting cache
    var cache_raw = null;
    var cache = null;

    try{
        cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
        cache = JSON.parse(cache_raw);
        
    } catch(err){
        client.recache(client)
        return
    }
    // Recaching if the time since it was last cached is shorter then recache_time
    const utc_time = new Date().getTime()
    const recache_time = 5 * 1000
    if(cache.timestamp+recache_time <= utc_time || (message.content == 'recache' && message.author.id == '325893549071663104') || Math.random()<0.1){
        
        // Updating member count
        cache.data.forEach(cache_guild => {
            if(cache_guild.member_count_channel){
                try{
                    let guild_count = client.guilds.cache.find(search_guild => search_guild.id == cache_guild.id)
                    if(guild_count){
                        let channel_count = guild_count.channels.cache.find(search_channel => search_channel.id == cache_guild.member_count_channel)
                        if(channel_count){
                            var memberCount = guild_count.members.cache.filter(member => !member.user.bot).size; 
                            channel_count.setName(`Members: ${memberCount}` )
                        }
                    }
                }
                catch(err){
                    console.log(err)
                    message.channel.send('An error has occurred')
                }
            }
        })
        // Recaching
    }
}
exports.conf = {
    event: "message"
};
    