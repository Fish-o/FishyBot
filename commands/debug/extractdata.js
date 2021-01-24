const { MessageAttachment } = require('discord.js');

exports.run = async (client, message, args) => {
    if(message.author.id !== client.config.master) return message.channel.send("Oops looks like you dont have the right permissions :(");
    let limit = Number(args[0])+1;
    if(!limit){
        return message.channel.send('Please set a limit to search for')
    }
    let fetched = await message.channel.messages.fetch({ limit });
    args.shift()
    let regextxt = args.join(' ');
    let isValid = true;
    let regex;
    try {
        regex = new RegExp(regextxt, 'ig');
    } catch(e) {
        isValid = false;
    }
    if(!isValid || !regex) return message.channel.send('The entered regex is not valid')
    
    let res = fetched.reduce(function(results, msg ){
        if(!results)
            results = []
        if(msg != message){
            let mathes = [...msg.content.matchAll(regex)];
            if(mathes && mathes[0])
                results.push( 
                    [msg.author.tag].concat(
                        mathes.map(match=>{
                            let out = match[1];
                            if(out.includes(`,`)){
                                if(out.includes(`"`)){
                                    out = out.replace(`"`, `""`)
                                }
                                out = `"`+out+`"`
                            }
                            return out;                   
                        }

                    )
                )
            )
            return results
        }
    }, [])

    let out = "";
    res.forEach(row => {
        out += `${row.join(`,`)}\n`
    });
    let attachment = new MessageAttachment(Buffer.from(out), 'data.csv')
    message.channel.send(attachment)
    
    



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
    name:"extract",
    description: "a debug command",
    usage: "no usage"
};