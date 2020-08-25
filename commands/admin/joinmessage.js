const fs = require('fs');
const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const moment = require("moment");



function colourNameToHex(colour){
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "rebeccapurple":"#663399","red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase().split(' ').join('')] != 'undefined') return colours[colour.toLowerCase()];
    if (/^#[0-9A-F]{6}$/i.test(colour)) return colour
    return false;
}


exports.run = (client, message, args) =>{
    var action = ''
    if(args[0]){
        var action = args[0].toLowerCase()
        args.shift()
    } else{
        var action = 'message';
    }
    if(!action || action == 'view'){
        const uri = client.config.dbpath
        var guild_data_promise = new Promise(function(resolve, reject){
            var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoClient.connect(err => {
                console.log('...conect');
                if (err) throw err;
                const collection = mongoClient.db("botdb").collection("v2");
                collection.find({id:message.guild.id}).toArray(function(err, result) {
                    console.log('...find');
                    if (err) {console.error(err); throw err};
                    
                
                    
                    //let new_results = [];
                    //for(i = 0; i < result.length; i++){
                    //	new_results.push(JSON.stringify({	id: result[i].id,
                    //						guild: result[i].guild}));
                    //}
                    mongoClient.close();
                    console.log('...close');
                    setTimeout(function(){
                        resolve(result);
                    }, 100);
                        
                });
            });
        });



        // Get guilds
        guild_data_promise.then( async function(value) {
            value = value[0]
            if(!value.joinMsg){return};

            

            const member = message.member;

            // Send the message to a designated channel on a server:
            const channel = member.guild.channels.cache.find(ch => ch.id === value.joinMsg.channelId);
            
            // Do nothing if the channel wasn't found on this server
            if (!channel) return;

            if(value.joinMsg.dm != '' && value.joinMsg.dm){
                
                member.send(value.joinMsg.dm.replace("{name}", member));
            }
            if(value.joinMsg.message) return channel.send(value.joinMsg.message)
            value.joinMsg.title
            value.joinMsg.desc

            // Send the message, mentioning the member
            
            
            let sicon = member.user.displayAvatarURL();
            let serverembed = new Discord.MessageEmbed();
            serverembed.setColor(value.joinMsg.color);
            serverembed.setThumbnail(sicon);
            serverembed.addField(value.joinMsg.title.b.replace("{name}", member.user.username)  ,value.joinMsg.title.s.replace("{name}", member));
            if(value.joinMsg.desc){
                serverembed.addField(value.joinMsg.desc.b.replace("{name}", member.user.username)   ,value.joinMsg.desc.s.replace("{name}", member));
            }
            try{
                channel.send(serverembed);
            } catch(err){
                console.log(err);
                message.channel.send('Error in join message');
            }
            /*
                .setColor("#ff0000")
                .setThumbnail(sicon)
                .addField("Here comes a new quester!",`A new member has joined to The VR Gang ${member}`)
                .addField("Where should i start ?","Read the 📄-rules, and then try running !friendme in the #🤝-friend-me channel!");



            */
        });
    }
    else if(action == 'edit' ||action == 'embed' ){
        if(!args[0]){

            message.channel.send("In what channel should it be, type `cancel` at any time to stop");
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(new_channel_raw_msg => {
                let new_channel_raw = new_channel_raw_msg.first().content;

                if(!new_channel_raw_msg.first().mentions.channels.first()){
                    if(new_channel_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')};
                }
                const new_channel_id = new_channel_raw_msg.first().mentions.channels.first().id;





                
                message.channel.send("What color should it be, enter a color name or a hex code");
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(color_raw_msg => {
                    var color_raw = color_raw_msg.first().content
                    const hex = colourNameToHex(color_raw)
                    if(hex == false) {return message.channel.send("Stopped, not a valid color name or hex code")}
                    const color = hex;


                    message.channel.send("What is going to be the tile (use {name} to insert the new members name)")
                    message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(title_bold_raw_msg => {
                        let title_bold_raw = title_bold_raw_msg.first().content;

                        if(title_bold_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')}
                        if(!title_bold_raw){return message.channel.send('Stopped')};
                        if(title_bold_raw.length >= 1000){return message.channel.send('Stopped, the message must be under 1000 characters long')};
                        const title_bold = title_bold_raw;






                        message.channel.send("What is going to be the tile's description")
                        message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(title_small_raw_msg => {
                            let title_small_raw = title_small_raw_msg.first().content;

                            if(title_small_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')}
                            if(!title_small_raw){return message.channel.send('Stopped')};
                            if(title_small_raw.length >= 2000){return message.channel.send('Stopped, the message must be under 2000 characters long')};
                            const title_small = title_small_raw;






                            message.channel.send("What is going to be the second blocks title? (type `none` to not have this)")
                            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(second_bold_raw_msg => {
                                let second_bold_raw = second_bold_raw_msg.first().content;

                                if(second_bold_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')}
                                if(!second_bold_raw){return message.channel.send('Stopped')};
                                if(second_bold_raw.toLowerCase() == "none"){
                                    
                                    const join_object = {
                                        channelId: new_channel_id,
                                        color: color,
                                        title: {
                                            b:title_bold,
                                            s:title_small
                                        }
                                    }
                                    const locate = "joinMsg"
                                    const value = {$set: {[locate]:join_object}}

                                    client.updatedb({id:message.guild.id}, value, 'Changed the message!', message.channel)// = function(query, value, msg = '', channel = null) {
                                    return 0
                                }

                                if(second_bold_raw.length >= 1000){return message.channel.send('Stopped, the message must be under 1000 characters long')};
                                const second_bold = second_bold_raw;


                                message.channel.send("What is going to be the second blocks description?")
                                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(second_small_raw_msg => {
                                    let second_small_raw = second_small_raw_msg.first().content;

                                    if(second_bold_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')}
                                    if(!second_bold_raw){return message.channel.send('Stopped')};
                                    if(second_bold_raw.length >= 2000){return message.channel.send('Stopped, the message must be under 2000 characters long')};

                                    const second_small = second_small_raw;

                                    const join_object = {
                                        channelId: new_channel_id,
                                        color: color,
                                        title: {
                                            b:title_bold,
                                            s:title_small
                                        },
                                        desc: {
                                            b:second_bold,
                                            s:second_small
                                        }
                                    }
                                    const locate = "joinMsg"
                                    const value = {$set: {[locate]:join_object}}

                                    client.updatedb({id:message.guild.id}, value, 'Changed the message!', message.channel)

                                });

                            });
                        });

                    });
                });
            });
        }
        
        
        //guild_data_promise.joinMsg.title
        //guild_data_promise.joinMsg.desc

    }
    else if(action == 'message' ||action == 'asdf' ){
        if(!args[0]){

            message.channel.send("In what channel should it be, type `cancel` at any time to stop");
            message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(new_channel_raw_msg => {
                let new_channel_raw = new_channel_raw_msg.first().content;

                if(!new_channel_raw_msg.first().mentions.channels.first()){
                    if(new_channel_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')};
                }
                if(!new_channel_raw_msg.first().mentions.channels){return message.channel.send("Stopped, please mention a channel")}
                const new_channel_id = new_channel_raw_msg.first().mentions.channels.first().id;


                message.channel.send("What is going to be the message? (use {name} to insert the new members name)")
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 60000}).then(title_bold_raw_msg => {
                    let title_bold_raw = title_bold_raw_msg.first().content;

                    if(title_bold_raw.toLowerCase() == 'cancel'){return message.channel.send('Stopped')}
                    if(!title_bold_raw){return message.channel.send('Stopped')};
                    if(title_bold_raw.length >= 2000){return message.channel.send('Stopped, the message must be under 2000 characters long')};
                    const title_bold = title_bold_raw;



                    

                    //const second_small = second_small_raw;

                    const join_object = {
                        channelId: new_channel_id,
                        message: title_bold
                    }
                    const locate = "joinMsg"
                    const value = {$set: {[locate]:join_object}}

                    client.updatedb(client.config.dbpath, {id:message.guild.id}, value, 'Changed the message!', message.channel)

                            
                });
            });
        };
    }
        
        //guild_data_promise.joinMsg.title
        //guild_data_promise.joinMsg.desc

    
    else if(action == 'remove'){
        const locate = "joinMsg"
        const value = {$set: {[locate]:undefined}}

        client.updatedb({id:message.guild.id}, value, 'Deleted the join message!', message.channel)

    }
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['joinmessage'],
    perms: [
        "ADMINISTRATOR"
    ]
};
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"joinmsg",
    description: "Allows you to add remove or view a join embed or message.",
    usage: "!joinmsg [view/embed/remove/message]"
};