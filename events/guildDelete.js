var fs = require("fs");
exports.event = async (client, guild) => {
    client.sendinfo('event: delete guild')
    /*var date = new Date();
                var Day = date.getDate() + "-" + date.getMonth()+1 + "-" + date.getFullYear();
                var Time = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
                fs.appendFile('./logs/'+ Day + '.log', '\n['+Time +'] '+`[GUILD LEAVE] ${guild.name} (${guild.id}) removed the bot.`, function (err) {
                });*/
        // If the settings Enmap contains any guild overrides, remove them.
        // No use keeping stale data!
    /*if (client.settings.has(guild.id)) {
      client.settings.delete(guild.id);
    }*/
};


exports.conf = {
    event: "guildDelete"
};