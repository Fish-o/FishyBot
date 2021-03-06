const Discord = require('discord.js');

const axios = require('axios');


var stringSimilarity = require('string-similarity');

//const Ssentry = require("@sentry/node");
//const Ttracing = require("@sentry/tracing");




let cache = new Discord.Collection();;
function doRequest(url, ttl= 10*60*1000) {
    return new Promise(async function (resolve, reject) {
        try{
            if(!cache.has(url) || cache.get(url).timestamp <= Date.now()){
                let r2 = await axios.get(
                    url
                )
                let data = r2.data;
                data.timestamp = Date.now() +ttl
                resolve(data)
                cache.set(url, data)
            } else {
                resolve(cache.get(url))
            }

        }
        catch{
            resolve(undefined)
        }
    });
}


let getVrmlStats = async function (client, args){
    return new Promise( async(resolve,reject) => {
        /*
        http://vrmasterleague.com/Services.asmx/GetTeamPlayersStats?game=onward&activeOnly=false&includeRetired=false
        https://vrmasterleague.com/Services.asmx/GetTeamStats?game=onward&teamName=MAYHEM

            args[0], actions:
            
            user
            match

            Gets all users and teams
            http://vrmasterleague.com/Services.asmx/GetTeamPlayersStats?game=echoarena&activeOnly=false&includeRetired=false
            
            
            Get team stats, mmr, win, lose, gp, rank
            https://vrmasterleague.com/Services.asmx/GetTeamStats?game=echoarena&teamName=Ignite


            Gets last n played matches
            https://vrmasterleague.com/Services.asmx/GetMatchesRecaps?game=echoarena&max=10
            

            Gets matches being played this week
            https://vrmasterleague.com/Services.asmx/GetMatchesThisWeek?game=echoarena&max=20
            

            https://vrmasterleague.com/Services.asmx/CheckUsernameExists?username=string
            https://vrmasterleague.com/Services.asmx/GetTeamLogo?game=string&teamName=string
            

            https://vrmasterleague.com/Services.asmx


            
        */  

        
        

        if(!args[0]){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Please enter a team name`).setTimestamp());
            return;
        }


        /*
            Todo:
            .add link to vrml page
            #next match
            .timing in country help

        */
        
        //if(action == 'team'){


        // Get the comming matches and all the teams.
        const all_team_url = 'https://vrmasterleague.com/Services.asmx/GetTeamPlayersStats?game=echoarena&activeOnly=false&includeRetired=false'
        const matches_url = 'https://vrmasterleague.com/Services.asmx/GetMatchesThisWeek?game=echoarena&max=100'
        


        // Make request them both at the same time
        let [all_teams, matches] = await Promise.all([
            doRequest(all_team_url, 3*60*60*1000),
            doRequest(matches_url, 2*60*60*1000)
        ])
        
        // Get the team names, and the url team name from the args
        var team_name = args.join(' ')
        var team_name_url = args.join('%20')
        
        // Return a message if not team name was entered
        if(!team_name){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Please enter a team name`).setTimestamp());
            return
        }
        

        // Find team in the team list
        let team = all_teams.find(team => team.name == team_name)


        // If no team was found, look if argument is player in a team
        if(!team){
            all_teams.forEach(TeamPlayer_team => {
                let player = TeamPlayer_team.players.find(player => player.name.toLowerCase() == team_name.toLowerCase() )

                if(player){
                    team_name = TeamPlayer_team.name;
                    team_name_url = team_name.split(' ').join('%20');
                    team = TeamPlayer_team;
                }

            })
        }


        // If still no team was found, get the team that is most simular to the team name enterd
        if(!team){
            let all_team_names = []
            all_teams.forEach(TeamPlayer =>{
                all_team_names.push(TeamPlayer.name)
            })
            let ratings = stringSimilarity.findBestMatch(team_name, all_team_names);
            if(ratings.bestMatch.rating <= 0.25){
                resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Could not find team`).setTimestamp())
                return
            }
            team_name = ratings.bestMatch.target
            team_name_url = team_name.split(' ').join('%20')
            team = all_teams.find(team => team.name == team_name)
            //message.channel.send(`Could not find exact team, going with: \`${team_name}\` (${Math.round(ratings.bestMatch.rating*100)}% sure)`)
        }

        if(!team){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Could not find team`).setTimestamp())
            return
        }
        
        const players = team.players

        
        // Get the logo and stats
        const logo_url = `https://vrmasterleague.com/Services.asmx/GetTeamLogo?game=echoarena&teamName=${team_name_url}`
        const stats_url = `https://vrmasterleague.com/Services.asmx/GetTeamStats?game=echoarena&teamName=${team_name_url}`;
        let [logos, stats] = await Promise.all([
            doRequest(logo_url, 12*60*60*1000),
            // I set the ttl (time before recaching) lowwer for the stats
            doRequest(stats_url, 5*60*1000)
        ])
        // Return a message if no logo was found
        if(!logos[0].Logo){
            resolve(new Discord.MessageEmbed().setColor('RED').setTitle(`Something went wrong with fetching the logo`).setTimestamp())
            return
        }

        // Find in the list of matches the ones from the enterd team
        var team_matches = matches.filter(match => match.homeTeam == team_name || match.awayTeam == team_name)
        




        // omfg i hate timezones, they are so stupid to work with, look at this stupid block of code!
        var time_name = 'gmt'
        var time_modifier = "Europe/England";
        var time_format = "en-GB";
        if(team.group=="America East"){
            // est
            time_name = 'America/New_York';
            time_modifier = "America/New_York";
            time_format = "en-US";
        }
        else if(team.group=="Europe"){
            //GMT
            time_name = 'GMT';
            time_modifier = 'Europe/England';
            time_format = "en-GB";
        }
        else if(team.group=="America West"){
            //UTC−08:00 PST
            time_name = 'PDT';
            time_modifier = "America/California";
            time_format = "en-US";
            
        }else if(team.group=="Oceania/Asia"){
            //UTC+10:00
            time_name = "AEST"
            time_modifier = "Australia/Victoria"
            time_format = "en-AU";
        }

        //  Time formatting:
        //      [2020-07-30 22:00]
        //    
        //  Split in space for date-time
        //  Split date in - for year - month - day
        //  split time in : for hours minutes
        let options = { weekday: 'long', year: 'numeric', month: 'long', hour:"2-digit", minute:"2-digit" };

        options.timeZone = time_name;
        options.timeZoneName = "short";

        // Go thru all the matches a team has, and format the time to the teams location
        team_matches.forEach(team_match =>{
            var raw_date_time = team_match.dateScheduled
            var [raw_date, raw_time] = raw_date_time.split(' ')

            var [year, month, day] = raw_date.split('-')

            var [hour, minutes] = raw_time.split(':')
            var seconds = 0

            var time_object = new Date(Date.UTC(year, month, day, hour, minutes))
            
            var converted = time_object.toLocaleString(time_format, options)

            team_match.dateScheduled = converted//.concat(' '+!vrml team Team Intergalactic)


        })
        

        // Set the description
        const description = `Games played: ${stats.gp}\nWins: ${stats.w}\nLosses: ${stats.l}\nPoints: ${stats.pts}\nMMR: ${stats.mmr}\nRank: ${stats.rank}`

        // Create the embed
        const embed = new Discord.MessageEmbed()

        // Set some static stuff for the embed
        embed.setColor('#0099ff')
        embed.setTitle(stats.name)
        embed.setAuthor(stats.divisionName, stats.divisionLogo)
            
        embed.setThumbnail(logos[0].Logo)
        embed.setDescription(description)

        // This spaghetti monster makes the team players look nice
        let team_members = "";//"```"
        players.forEach(player => {
            if(player.roleName == 'Team Owner'){
                team_members = team_members.concat(`${player.name}, ${player.country},  Owner \n`)
            }
            else{
                team_members = team_members.concat(`${player.name}, ${player.country} \n`)
            }
        });
        team_members = team_members.slice(0, -2)
        embed.addFields({name:'Team members', value:team_members, inline:false})

        // This spaghetti monster makes the matches look nice
        if(team_matches !== []){
            let match_text="";
            var print = false;
            team_matches.forEach(match => {
                print = true
                match_text = match_text.concat(`[${match.dateScheduled}]\n`)
                match_text = match_text.concat(`${match.homeTeam} vs ${match.awayTeam}\n`)

                if(match.CasterName != ''){
                    match_text = match_text.concat(`Casted by: [${match.casterName}](${match.channel}) vs \n`)
                }
                
                

            })
            if(print){
                embed.addFields({name:'Matches this week', value:match_text, inline: false})
            }
            else{
                embed.addFields({name:'Matches this week', value:'No matches found', inline: false})
            }
        }
        
        // Add timestamp  
        embed.setTimestamp()

        // Return the embed!
        resolve(embed)
        return
    });
    
    // Send the embed!
    
}



exports.interaction = async(client, interaction, args) => {
    interaction.channel.startTyping();
    try{
        let embed = await getVrmlStats(client, args[0].value.split());
        interaction.send(embed)
    }
    catch(err){
        //Sentry.captureException(err);
        console.log(err)
        client.sendInfo(`ERROR: echovrml interaction (${Date.now()})`)
        interaction.channel.send('Something has gone wrong with the echovrml command')
    } finally{
        interaction.channel.stopTyping()
    }
}
exports.run = async(client, message, args) => {
    if(!args?.[0]){
        return message.channel.send("Please provide a team or team member as argument")
    }
    message.channel.startTyping();
    try{
        let embed = await getVrmlStats(client, args[0].value.split());
        return message.channel.send(embed)
    }
    catch(err){
        //Sentry.captureException(err);
        console.log(err)
        client.sendInfo(`ERROR: echovrml interaction (${Date.now()})`)
        return message.channel.send('Something has gone wrong with the echovrml command')
    } finally{
        message.channel.stopTyping()
    }

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    interaction:{
        options: [
            {
                name: "Team",
                description: "An Echo Vrml team's name",
                required: true,
                type: 3
            }
        ]
    },
    aliases: ['vrmlecho', 'echoteam'],
    perms: [

    ]
};
  
const path = require("path") 
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"echovrml",
    description: "Returns echo arena vrml stats of a team",
    usage: "echovrml [team / team member]"
};

asdf = {
    name:"logon",
    description:"log the bot onto the server",
    options: [

    ]
}


