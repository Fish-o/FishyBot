var fs = require("fs");
exports.event = async (client, guild) => {
    client.sendinfo('event: delete guild')
};


exports.conf = {
    event: "guildDelete"
};