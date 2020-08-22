const dad_activations = ['i am', 'im', 'i\'m']

exports.run = (client, message) => {
    dad_activations.forEach(dad_activation =>{
        let index = message.content.toLowerCase().indexOf(dad_activation)
        if(index > -1){
            let start = message.content.slice(index + dad_activation.length)
            let final = start.split(/[,.]/)[0]
            return message.channel.send(`Hi ${final}, I'm dad!`);
        }
    })
}



exports.conf = {
    enabled: true,
    guildOnly: false,
    activations: dad_activations,
    perms: []
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"Dad joke maker",
    description: "Hi son, im dad!"
}

