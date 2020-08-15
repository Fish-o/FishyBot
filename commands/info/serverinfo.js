const Discord = require('discord.js');
var vega = require('vega')
var moment = require('moment'); // require
exports.run = async (client, message, args) =>{
    
      

    
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


    let vega_chart = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "mark": {"type": "area", "color": "#0084FF", "interpolate": "monotone"},
        "encoding": {
          "x": {
            "field": "date",
            "type": "temporal",
            "timeUnit": "yearmonthdate",
            "axis": {"title": "Date"}
          },
          "y": {
            "field": "users",
            "type": "quantitative",
            "axis": {"title": "Users"}
          },
          "opacity": {"value": 1}
        },
        "width": 1200,
        "height": 600,
        "data": {
          "values": nice_array
        },
        "config": {}
    }
    var view = new vega
        .View(vega.parse(vega_chart))
        .renderer('none')
        .initialize();

    const canvas = await view.toCanvas()
    fs.writeFile(`/../../chart${message.guild.id}.png`, canvas.toBuffer())

    /*.then(function (canvas) {
          // process node-canvas instance for example, generate a PNG stream to write var
          // stream = canvas.createPNGStream();
          console.log('Writing PNG to file...')
          fs.writeFile('stackedBarChart.png', canvas.toBuffer())
        })
        .catch(function (err) {
          console.log("Error writing PNG to file:")
          console.error(err)
        });*/

    /*const getDateXObj = rangeLen => ({
    field: 'date',
    type: `${rangeLen > 30 ? 'temporal' : 'ordinal'}`,
    timeUnit: 'yearmonthdate',
    axis: {
        title: 'Date',
        labelAngle: -45,
    },
    });*/
    

    console.log(nice_data)
    console.log(Object.keys(nice_data))
    console.log(Object.values(nice_data))
    var myChart = {
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
            /*title: {
                display: true,
                fontColor: 'blue',
                text: 'Custom Chart Title'
            },*/
            scales: {
                xAxes: [{
                    type: 'time',
                    ticks:{
                        fontColor: 'white'
                    }
                    /*gridLines: {
                        lineWidth:3,
                        color: 'rgba(255, 255, 255, 0.7)'
                      }*//*,
                    time: {
                        unit: 'day'
                    },
                    distribution: 'linear'*/
                }],
                yAxes:[{
                    ticks:{
                        fontColor: 'white'
                    }
                    /*gridLines: {
                        lineWidth:3,
                        color: 'rgba(255, 255, 255, 0.7)'
                      },*/
                }]
            }
        }
    }

    //var IMAGE = "https://quickchart.io/chart?c="+encodeURIComponent(JSON.stringify(myChart));
    //console.log(IMAGE)

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.MessageEmbed()
        .setImage(`/../../chart${message.guild.id}.png`)
        .setAuthor(`${message.guild.name} - Informations`, message.guild.iconURL)
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
        .setTimestamp(message.guild.createdAt);

    message.channel.send(serverembed);
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['server'],
    perms: [
    ]
  };
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"serverinfo",
    description: "Gives the info of the server",
    usage: "!serverinfo"
};