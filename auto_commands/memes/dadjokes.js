

exports.run = (client, message) => {    
    const dad_activations = ['i am', 'im', 'i\'m']
    dad_activations.forEach(dad_activation =>{
        let index = message.content.toLowerCase().indexOf(dad_activation)
        if(index > -1){
            let start = message.content.slice(index + dad_activation.length)
            let final = start.split(/[,.]/)[0]
            message.channel.send(`Hi${final}, I'm dad!`);
        }
    })
}



exports.conf = {
    enabled: true,
    guildOnly: true,
    activations: ['i am', 'im', 'i\'m'],
    perms: []
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"dadjokes",
    description: "Hi son, im dad! \nTo turn this off, go to !settings dadjokes off, or !settings all_auto off"
}

