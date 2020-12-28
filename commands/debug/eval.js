function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}
let Discord = require("discord.js");
exports.run = async (client, message, args) => {
    if(message.author.id !== client.config.master) return;

    try {
        const code = args.join(" ");
        let evaled = await eval(code);
  
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
  
        message.channel.send(clean(evaled), {code:"xl"});
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
      }
    
}



exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: []
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"eval",
    description: "a debug command",
    usage: "no usage"
};


