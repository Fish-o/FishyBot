
exports.run = (client, message, args) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    
    if(!member)
        return message.channel.send("Please mention a valid member of this server");
    if(!member.bannable) 
        return message.channel.send("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    member.ban({reason: reason})
        .catch(error => message.channel.send(`Sorry ${message.author} I couldn't ban the user`));

    message.channel.send(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);



    // Make sqlite connection
    //let db = new sqlite3.Database(config['dbpath'], (err) => {
    //    if (err) {
    //        return console.error(err.message);
    //    }
    //    console.log('Connected to the SQlite database.');
    //});

    

    // Close connection
    //db.close((err) => {
    //    if (err) {
    //        return console.error(err.message);
    //    }
    //    console.log('Close the database connection.');
    //});

    

    
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [
        'BAN_MEMBERS'
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"ban",
    description: "Ban a user from the server",
    usage: "ban [user] [reason]"
};