const Discord = require('discord.js');
var moment = require('moment'); // require


const ChartJsImage = require('chartjs-to-image');

//const Ssentry = require("@sentry/node");
//const Ttracing = require("@sentry/tracing");

exports.run = async (client, message, args) =>{
    message.channel.startTyping(1)
      

    try{
        function checkBots(guild) {
            let botCount = 0;
            guild.members.cache.forEach(member => {
                if(member.user.bot) botCount++;
            });
            return botCount;
        }
        
        function checkMembers(guild) {
            let memberCount = 0;
            guild.members.cache.forEach(member => {
                join_dates.push(member.joinedAt)
                if(!member.user.bot) memberCount++;
            });
            return memberCount;
        }

        function checkOnlineUsers(guild) {
            let onlineCount = 0;
            guild.members.cache.forEach(member => {
                if(member.user.presence.status === "online")
                    onlineCount++; 
            });
            return onlineCount;
        }


        let join_dates = [];
        message.guild.members.cache.forEach(member => {
            if(!member.bot){
            join_dates.push(moment(moment.utc(member.joinedAt).format('DD/MM/YYYY'), "DD-MM-YYYY").unix())
            }   
        });
        join_dates.sort()
        let data={[join_dates[0]]:0};
        let nice_data={}


        let last_date = join_dates[0];
        join_dates.forEach(join_date =>{
            
            if(data[join_date]){
                data[join_date] = data[join_date]+1;
            }else{
                data[join_date] = data[last_date]+1;
                
                //convert the unix time of the last to dd/mm/yyyy
                nice_data[moment.utc(parseInt(last_date)*1000).format('YYYY/MM/DD')] = data[last_date]

            }
            last_date= join_date;
        })
        
        let nice_array = [];
        Object.keys(nice_data).forEach(date => {

            nice_array.push({users: nice_data[date], date: date})


        })


        
        

        console.log(nice_data)
        console.log(Object.keys(nice_data))
        console.log(Object.values(nice_data))

        //var canvas = createCanvas(600,400)//600, 400)
        //var ctx = canvas.getContext('2d')
        //console.log(JSON.stringify(ctx))
        const mychartOptions = {
            type: 'line',
            
            data: {
                labels: Object.keys(nice_data),
                datasets:[{
                    label: 'Members over time',
                    //color: 'rgba(255, 255, 255, 1)',
                    data: Object.values(nice_data),
                    fill: true
                }]
            },
            options: {
                legend: {
                    labels: {
                        fontColor: 'White'
                    }
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        ticks:{
                            fontColor: 'white'
                        }
                    }],
                    yAxes:[{
                        ticks:{
                            fontColor: 'white'
                        }
                    }]
                }
            }
        };

        const myChart = new ChartJsImage();
        myChart.setConfig(mychartOptions)
        myChart.setBackgroundColor('transparent').setWidth(500).setHeight(300).setDevicePixelRatio(10);
        const buf = await myChart.toBinary();
        
        

        const attachment = new Discord.MessageAttachment(buf,'chart.png'); 


        
        let sicon = message.guild.iconURL;
        let serverembed = new Discord.MessageEmbed()
            
            .setTitle(`${message.guild.name} - Information`, message.guild.iconURL)
            .setColor("#15f153")
            .addField('Server owner', message.guild.owner, true)
            .addField('Server region', message.guild.region, true)
            .setThumbnail(sicon)
            .addField("Server Name", message.guild.name)
            .addField('Verification level', message.guild.verificationLevel, true)
            .addField('Channel count', message.guild.channels.cache.size, true)
            .addField('Total member count', message.guild.memberCount)
            .addField('Humans', checkMembers(message.guild), true)
            .addField('Bots', checkBots(message.guild), true)
            .addField('Online', checkOnlineUsers(message.guild))
            
            .setFooter(message.guild.id+ ' created at:')
            .setTimestamp(message.guild.createdAt)

            .attachFiles(attachment)
            .setImage('attachment://chart.png');
        /*    if(IMAGE){
            serverembed.setImage(IAMGE)
        }*/
        return message.channel.send(serverembed);
    }catch(err){
        //Sentry.captureException(err);
        console.log(err)
        console.log('An erro has occured with the serverinfo command')
        return message.channel.send('Something has gone wrong!')
    } finally{
        message.channel.stopTyping()
    }

}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['server', 'serverstats'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"serverinfo",
    description: "Gives the info of the server",
    usage: "serverinfo"
};