const Discord = require('discord.js');
const Enmap = require("enmap");
const moment  = require("moment");
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

const client = new Discord.Client();



require('dotenv').config();

const config = require("./jsonFiles/config.json");
client.config = config;
client.config.token = process.env.TOKEN
client.config.dbpath = process.env.DBPATH

const rawdata = fs.readFileSync(__dirname + '/jsonFiles/emojis.json');
const emoji_data = JSON.parse(rawdata);
client.emoji_data = emoji_data;









fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
    });
});

//client.commands = new Enmap();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.bypass = false;
client.master = client.config.master

fs.readdir("./commands/", (direrr, dirs) =>{
    if (direrr) {
        return console.log('Unable to scan directory: ' + err);
    }
    console.log(dirs)
    
    dirs.forEach(dir => {
        const path = "./commands/"+dir+"/";
        fs.readdir(path, (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
            
                let props = require(path+file);
                console.log(`Loading Command: ${props.help.name}`);
                client.commands.set(props.help.name, props);

                props.conf.aliases.forEach(alias => {
                    client.aliases.set(alias, props.help.name);
                });
            
            
                /*
                let props = require(path+file);
                let commandName = file.split(".")[0];
                console.log(`Attempting to load command ${commandName}`);
                client.commands.set(commandName, props);
                */
            });
        });

    })
})











console.log('should have done shit')


client.recache = function (){
    const uri = client.config.dbpath;
    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        console.log('...conect');
        if (err) throw err;
        const collection = mongoClient.db("botdb").collection("v2");
        collection.find({}).toArray(function(err, result) {
            console.log('...find');
            if (err) {console.error(err); throw err};
            mongoClient.close();
            console.log('...close');
            var data = {timestamp:new Date().getTime(),
                data:result}

            var jsonData = JSON.stringify(data);
            var fs = require('fs');

            fs.writeFile(__dirname + '/jsonFiles/cache.json', jsonData, function(err) {
                if (err) {
                    console.log(err);
                }
            }); 
        });
    });
}

client.updatedb = function(query, value, msg = '', channel = null) {
    const uri = client.config.dbpath;

    var mongoClient = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoClient.connect(err => {
        if (err) console.log(err);
        const collection = mongoClient.db("botdb").collection("v2");
        collection.updateOne(query, value, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            mongoClient.close();
            if(msg != '' && channel){
               channel.send(msg)
            }
        });
    })


}


client.elevation = function (msg) {
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


client.sendinfo = function (info){
    client.channels.cache.get('739211875610525746').send(info);
}

client.login(config.token);