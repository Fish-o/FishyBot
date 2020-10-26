const fs = require('fs');

const  User = require('../../database/schemas/User')
const  Guild = require('../../database/schemas/Guild')

exports.run = async (client, message, args) => {
    
    let rawdata = fs.readFileSync(__dirname + '/../../jsonFiles/emojis.json');
    const emoji_data = JSON.parse(rawdata);
    

    var member = message.author

    if( message.mentions.users.first() && message.member.hasPermission("MANAGE_MESSAGES")){
        member = message.mentions.users.first()
    }
    


    message.channel.send('Click on the emoji of the platform to add your name to.').then(sent => {
        for(let platform in emoji_data.logos){
            sent.react(emoji_data.logos[platform]);
        };

        const filter = (reaction, user) => user.id == message.author.id && Object.values(emoji_data['logos']).includes(reaction.emoji.id);
        sent.awaitReactions(filter, {max:1, time:30000}).then(collected =>{
            if(collected.first()){
                var emojiID = collected.first().emoji.id

                var key = Object.keys(emoji_data['logos']).find(key => emoji_data['logos'][key] == emojiID)
                message.reply('Enter your **'+key+'** username. Type `CANCEL` in all caps to stop the operation.')
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then( async collected => {
                    if(collected.first().content){
                        if(collected.first().content == 'CANCEL'){
                            message.reply('Operation cancled')
                        }
                        else{
                            const username = collected.first().content;
                            const platform = key;
                            const userID = member.id;


                            /*let db_guild_data = value;
                            var db_user_data = db_guild_data.users[userID];*/
                            

                            var newquery = {id: message.guild.id};
                            const locate_string = "users."+userID+".data.usernames."+platform  
                            var newnewvalues = { $set: {[locate_string]:username}}

                            await Guild.updateOne({id: message.guild},  {[`usernames.${userID}.${platform}`]: username});
                            message.channel.send('Changed **'+platform+'** username to `'+username+'`')


                        }

                    }
                    else{
                        message.reply('Timed-out')
                    }

                });


            }
            else{
                message.channel.send('Timed-out')
            }   
        }).catch(collected =>{
            message.channel.send('catched')
        });
    
    });
    


    //message.reply()



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
    name:"friendme",
    description: "Saves your usernames, so other people can see it with !userinfo",
    usage: "f!friendme"
};