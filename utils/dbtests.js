exports.allow_test = function(client, cmd_name, guild_id){
    let cache_raw = fs.readFileSync(__dirname + '/../jsonFiles/cache.json');
    let cache = JSON.parse(cache_raw);

    const locate_string = cmd_name
    
    let guild_cache = cache.data.find(guild_cache_raw => guild_cache_raw.id == guild_id)
    if(guild_cache.settings[cmd_name] == false){return false}
    client.recache()
    return true
}


exports.elevation = function (client, msg) {
    /* This function should resolve to an ELEVATION level which
    is then sent to the command handler for verification*/
    let permlvl = 0;
    let mod_role = msg.guild.roles.find("name", "Moderator");
    if (mod_role && msg.member.roles.has(mod_role.id)) permlvl = 2;

    let admin_role = msg.guild.roles.find("name", "Administratorl");
    if (admin_role && msg.member.roles.has(admin_role.id)) permlvl = 3;

    if (msg.author.id === "325893549071663104") permlvl = 4;
    return permlvl;
};