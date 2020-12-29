let Discord = require('discord.js');
let fact = require('./fact').command;
let simp = require('./simp').command;


let cat = require('./cat').command;
let dog = require('./dogs').command;
let goose = require('./goose').command;

let coin = require('./flipcoin').command;
let dice = require('./rolldice').command;
let eightBall = require('./8ball').command;


exports.interaction = async function(client, interaction, args){
    let subcommandGroup = args[0].name;
    if(subcommandGroup == "simp"){
        let memberID = args[0].options.find(option => option.name == 'simp');
        let action = args[0].options.find(option => option.name == 'action');

        if(!memberID || !action){
            return interaction.send(await interaction.error('No action or simp found'));
        }
        memberID = memberID.value;
        action = action.value;

        let guild = interaction.guild;
        let member = guild.members.cache.get(memberID);
        let sender = interaction.member;

        if(!member || !action || !guild || !member || !sender){
            return interaction.send(await interaction.error('Something has gone wrong'));
        }

        if(action == "action_lb"){
            action = 'lb'
        } else if(action == "action_add"){
            action = 'add'
        }else if(action == "action_clear"){
            action = 'clear'
        }
        
        let msg = await simp(client, member, sender, guild, action)
        interaction.send(msg || 'ERROR')
    } else if(subcommandGroup == "fact"){
        return interaction.send(await fact())
    
    } else if(subcommandGroup == "animals"){
        let animal = args[0].options[0].value
        if(animal == 'animal_cat'){
            interaction.send(await cat() ||'error')
        }else if(animal == 'animal_dog'){
            interaction.send(await dog() ||'error')
        }else if(animal == 'animal_goose'){
            interaction.send(await goose() ||'error')
        }
        
    } else if(subcommandGroup == "random"){
        let type = args[0].options[0].name;
        if(type == 'coin'){
            interaction.send(await coin(interaction.member) || 'error')
        } 
        
        else if(type == 'dice'){
            interaction.send(await dice() || 'error')
        } 
        
        else if(type == '8ball'){
            let question = args[0].options[0].options[0].value;
            
            interaction.send(await eightBall(question, interaction.member) || 'error')
        }


    }

}





exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        options:[
            {
                name:'animals',
                description:'Random picture of an animal',
                type:1,
                default:true,
                options:[
                    {
                        name: "animal",
                        description: "The type of animal",
                        type: 3,
                        required:true,
                        choices: [
                            {
                                name: "Dog",
                                value: "animal_dog"
                            },
                            {
                                name: "Cat",
                                value: "animal_cat"
                            },
                            {
                                name: "Goose",
                                value: "animal_goose"
                            }
                        ]
                    }
                ]
            },
            {  
                name:'random',
                description:'Get a random diceroll or coinflip',
                type:2,
                default:false,
                options:[
                    {
                        name:'dice',
                        description:'Roll a dice',
                        type:1,
                        default:true,
                        options:[
                        ]
                    },
                    {
                        name:'coin',
                        description:'Flip a coin',
                        type:1,
                        default:false,
                        options:[
                        ]
                    },
                    {
                        name:'8ball',
                        description:'Ask the magic 8ball',
                        type:1,
                        default:false,
                        options:[
                            {
                                name:'Question',
                                description:'The question to to the 8ball',
                                type:3,
                                required:true
                            }
                        ]
                    }
                ]
            },

            {
                name:'fact',
                description:'Get a random fact',
                type:1,
                default:false,
                options:[

                ]
            },
            {
                name:'simp',
                description:'Acuse someone of being a simp',
                type:1,
                default:false,
                options:[
                    {
                        name:'simp',
                        description:'The simp',
                        type:6,
                        required:true
                    },
                    {
                        name: "action",
                        description: "What action to perform",
                        type: 3,
                        required:true,
                        choices: [
                            {
                                name: "Add",
                                value: "action_add",
                                default:true
                            },
                            {
                                name: "Leaderboard",
                                value: "action_lb"
                            },
                            {
                                name: "Clear",
                                value: "action_clear"
                            }
                        ]
                    }
                    
                ]
            },
            

        ]
    },
    aliases: [],
    perms: [
    ]
};
  
const path = require("path");

exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"fun",
    description: `A collection of fun commands`,
    usage: "no usage"
};
