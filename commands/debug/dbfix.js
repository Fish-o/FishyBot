let Guild = require('../../database/schemas/Guild');

exports.run = async (client, message, args, db_guild) => {
    await Guild.updateMany({randomstuff:{$exists:false}}, { $set:{randomstuff:{simpcounter:{}}} })
    


}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        
    ]
  };
  

const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"dbfix",
    description: "Call someone out for being a simp",
    usage: "dbfix (member) [clear]"
};
