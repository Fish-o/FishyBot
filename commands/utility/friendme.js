const fs = require('fs');

const  User = require('../../database/schemas/User')
const  Guild = require('../../database/schemas/Guild')

exports.run = async (client, message, args, dbGuild) => {
    let rawdata = fs.readFileSync(__dirname + '/../../jsonFiles/emojis.json');
    const emoji_data = JSON.parse(rawdata);

    if(!message.member){
        console.log('NO MEMEMEMBER')
        if(Object.keys(dbGuild.usernames).length == 0){
            console.log('szzz')
            let user = message.author;


            await message.channel.send(`Hello, it seems like you are new to this, so im going to explain this a bit.
The username system has 2 different types of usernames, global usernames, and server specific usernames.
By running ${client.config.prefix}friendme in a server you will set server specific usernames.
And by running ${client.config.prefix}friendme, you will set a global username.
Now good luck!`)
            await client.func.sleep(2000)

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
                                const userID = message.author.id;
    
    
                                /*let db_guild_data = value;
                                var db_user_data = db_guild_data.users[userID];*/

                                let dbUser = {
                                    [`usernames.${platform}`]:username
                                }
                                
                                console.log(await User.findOneAndUpdate({discordId:userID}, {[`usernames.${platform}`]:username }))

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
    } else{
    
        

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
    }        


    //message.reply()



}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        
    ]
  };
  
const path = require("path");
const { time } = require('console');
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"friendme",
    description: "Saves your usernames, so other people can see it with !userinfo",
    usage: "friendme"
};