
exports.run = (client, message, args) => {
    function myFunc() {
       
    }

    var i =0;
    const m = 50;
    const s = 50;

    const msges =  m + 2.0 * s * (Math.random() + Math.random() + Math.random() - 1.5);
    const rounded =Math.max(5, Math.round(msges))
    var i = 0;                  //  set your counter to 1
    message.channel.send(`${rounded} messages coming up!`)
    function myLoop() {         //  create a loop function
        setTimeout(function() { //  call a 3s setTimeout when the loop is called
            try{                    
                message.author.send(`Ping ${i + 1}`)   //  your code here
                i++;                            //  increment the counter
                if (i < rounded) {              //  if the counter < 10, call the loop function
                    myLoop();                   //  ..  again which will trigger another 
                }   
            }  catch(err){

            }                                  //  ..  setTimeout()
        }, 2000)
    }

    myLoop();   

    
    /*for(i = 0; i < 60; i++){
        setTimeout(myFunc, 1010*i);
    }*/
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"spam",
    description: "Sends a random amount of messages to the user who called it in dm's",
    usage: "spam"
};

