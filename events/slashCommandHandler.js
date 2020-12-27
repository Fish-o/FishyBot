
const Guild = require('../database/schemas/Guild');
const axios = require('axios');
const Discord = require('discord.js')


/*

{
  version: 1,
  type: 2,
  token: 'asdf'
  member: {
    user: {
      username: 'Fish',
      public_flags: 256,
      id: '325893549071663104',
      discriminator: '2455',
      avatar: '5a4e62341afa47f200bd8f0dcf759512'
    },
    roles: [
      '790969042851856425',
      '790969058710519808',
      '790969073210097715'
    ],
    premium_since: null,
    permissions: '2147483647',
    pending: false,
    nick: 'sdfgsdfg',
    mute: false,
    joined_at: '2020-09-06T13:18:35.776000+00:00',
    is_pending: false,
    deaf: false
  },
  id: '792502570592894986',
  guild_id: '752155794153406476',
  data: { name: 'help', id: '791272914905333760' },
  channel_id: '784438571620106311'
}
*/



exports.event = async (client, interaction) => {
    let guild_cache = await client.getDbGuild(interaction.guild_id)
    interaction.guild = client.guilds.cache.get(interaction.guild_id)
    interaction.channel = interaction.guild.channels.cache.get(interaction.channel_id)
    interaction.member = interaction.guild.members.cache.get(interaction.member.user.id)

    // Make .send a propperty of the interaction
    interaction.send = async function(message, embed){ 
        return new Promise(async(resolve, reject)=>{
            if(typeof message == 'object'){
                embed = message;
                message = undefined;
            }
            resolve(await client.api.interactions(this.id, this.token).callback.post( {data: { type: 4, data: { content: message, embeds:(embed) ? [embed] : undefined } } })) 
        })
    }
    interaction.error = async function(message, desc){
        return new Promise(async (resolve, reject) =>{
            let embed = new Discord.MessageEmbed().setColor('RED').setTitle(message).setTimestamp();
            if(desc){
                embed.setDescription(desc);
            }
            resolve(await embed) 
        })
    }
    interaction.succes = async function(message, desc){
        return new Promise(async (resolve, reject) =>{
            let embed = new Discord.MessageEmbed().setColor('GREEN').setTitle(message).setTimestamp();
            if(desc){
                embed.setDescription(desc);
            }
            resolve(await embed) 
        })
    }
    interaction.delResponse = async function(time){
        return new Promise(async(resolve, reject)=>{
            if(time)
                await client.func.sleep();
            client.api.webhooks(user.id, this.token).messages.delete()
        })
    }


    // Define the command and the args
    const commandName = interaction.data.name.toLowerCase();
    const args = interaction.data.options;
    
    if(!client.interactions.has(commandName)) return;

    let cmd = client.commandFiles.get(client.interactions.get(commandName))
    if(!cmd) return;

    // Check if it is disabled
    if(!await client.allow_test(cmd.help.name, guild_cache))
        return;

    // Check for the name of the command
    var succes = true;
    let required = 'You are missing the following permisions:\n';
    if(!client.bypass || interaction.member.user.id !== client.config.master){
        let permroles = [];

        if(guild_cache.roleperms){
            Object.keys(guild_cache.roleperms).forEach(roleid => {
                if(interaction.member.roles.cache.get(roleid)){
                    permroles.push(guild_cache.roleperms[roleid]) 
                }
            })
        }
        cmd.conf.perms.forEach(permision => {
            try{
                if(!interaction.member.hasPermission(permision) && !permroles.find(perms => perms.includes(permision.toLowerCase()))){
                    succes = false;
                    required += permision + ' '
                }
            }
            catch(err){
                console.log(err)
                return interaction.send("Something went wrong, please contact "+client.config.author);
            }
        });
    }
    if(!succes) return interaction.send(required);

    cmd.interaction(client, interaction, args)

};


exports.conf = {
    event: "INTERACTION_CREATE"
};

