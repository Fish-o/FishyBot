const Discord = module.require('discord.js');

const request = require('request');
cachedRequest = require('cached-request')(request);
cacheDirectory = "/../../jsonFiles/cache/vrml/";
cachedRequest.setCacheDirectory(cacheDirectory);



const fs = require('fs');
require('log-timestamp');
var stringSimilarity = require('string-similarity');






function doRequest(url, ttl= 10*60*1000) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: url,
            ttl:ttl,
            json: true
        };
        cachedRequest(options, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}




exports.run = async(client, message, args) => {
    console.log("Start command")
    /*
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

    
    

    if(!args){return}
    const action = args[0].toLowerCase()
    args.shift()

    /*
        Todo:
         .add link to vrml page
         #next match
         .timing in country help

    */
    
    if(action == 'team'){
        console.log("start team")


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
        if(!team_name){return message.channel.send('Enter a team name')}
        

        // Find team in the team list
        let team = all_teams.TeamPlayers.find(team => team.Name == team_name)

        // If no team was found, get the team that is most simular to the team name enterd
        if(!team){
            let all_team_names = []
            all_teams.TeamPlayers.forEach(TeamPlayer =>{
                all_team_names.push(TeamPlayer.Name)
            })
            let ratings = stringSimilarity.findBestMatch(team_name, all_team_names);
            if(ratings.bestMatch.rating <= 0.25){
                return message.channel.send("Could not find team")
            }
            team_name = ratings.bestMatch.target
            team_name_url = team_name.split(' ').join('%20')
            team = all_teams.TeamPlayers.find(team => team.Name == team_name)
            message.channel.send(`Could not find exact team, going with: \`${team_name}\` (${Math.round(ratings.bestMatch.rating*100)}% sure)`)
        }
        
        const players = team.Players

        
        // Get the logo and stats
        const logo_url = `https://vrmasterleague.com/Services.asmx/GetTeamLogo?game=echoarena&teamName=${team_name_url}`
        const stats_url = `https://vrmasterleague.com/Services.asmx/GetTeamStats?game=echoarena&teamName=${team_name_url}`;
        let [logos, stats] = await Promise.all([
            doRequest(logo_url, 12*60*60*1000),
            // I set the ttl (time before recaching) lowwer for the stats
            doRequest(stats_url, 5*60*1000)
        ])
        
        // Return a message if no logo was found
        if(!logos[0].Logo){return message.channel.send('Something went wrong')}

        // Find in the list of matches the ones from the enterd team
        var team_matches = matches.filter(match => match.HomeTeam == team_name || match.AwayTeam == team_name)
        




        // omfg i hate timezones, they are so stupid to work with, look at this stupid block of code!
        var time_name = 'gmt'
        var time_modifier = "Europe/England";
        var time_format = "en-GB";
        if(team.Group=="Americas East"){
            // est
            time_name = 'America/New_York';
            time_modifier = "America/New_York";
            time_format = "en-US";
        }
        else if(team.Group=="Europe"){
            //GMT
            time_name = 'GMT';
            time_modifier = 'Europe/England';
            time_format = "en-GB";
        }
        else if(team.Group=="Americas West"){
            //UTC−08:00 PST
            time_name = 'PST';
            time_modifier = "America/California";
            time_format = "en-US";
            
        }else if(team.Group=="Oceania/Asia"){
            //UTC+10:00
            time_name = "AEST"
            time_modifier = "Australia/Victoria"
            time_modifier = "en-AU";
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
            var raw_date_time = team_match.DateScheduled
            var [raw_date, raw_time] = raw_date_time.split(' ')

            var [year, month, day] = raw_date.split('-')

            var [hour, minutes] = raw_time.split(':')
            var seconds = 0

            var time_object = new Date(Date.UTC(year, month, day, hour, minutes))
            
            var converted = time_object.toLocaleString(time_format, options)

            team_match.DateScheduled = converted//.concat(' '+!vrml team Team Intergalactic)


        })
        






        // Set the description
        const description = `Games played: ${stats.GP}\nWins: ${stats.W}\nLosses: ${stats.L}\nPoints: ${stats.PTS}\nMMR: ${stats.MMR}`

        // Create the embed
        const embed = new Discord.MessageEmbed()

        // Set some static stuff for the embed
        embed.setColor('#0099ff')
        embed.setTitle(stats.Name)
        embed.setAuthor(stats.DivisionName, stats.DivisionLogo)
            
        embed.setThumbnail(logos[0].Logo)
        embed.setDescription(description)

        // This spaghetti monster makes the team players look nice
        let team_members = "";//"```"
        players.forEach(player => {
            if(player.Role == 'Team Owner'){
                team_members = team_members.concat(`${player.Name}, ${player.Nationality},  Owner \n`)
            }
            else{
                team_members = team_members.concat(`${player.Name}, ${player.Nationality} \n`)
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
                match_text = match_text.concat(`[${match.DateScheduled}]\n`)
                match_text = match_text.concat(`${match.HomeTeam} vs ${match.AwayTeam}\n`)

                if(match.CasterName != ''){
                    match_text = match_text.concat(`Casted by: [${match.HomeTeam}](${match.channel}) vs \n`)
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
            
        // Send the embed!
        message.channel.send(embed);

        console.log("End team")
    }

    /*
        Todo:
         .Level

    
    
    if(action == 'player' || action == 'user'){
        //var msg = await message.channel.send('Loading...')
        const user_name = args.join(' ')
        const user_name_url = args.join('%20')
        
        

        const all_team_url = 'https://vrmasterleague.com/Services.asmx/GetTeamPlayersStats?game=echoarena&activeOnly=false&includeRetired=false'
        const all_teams = await doRequest(all_team_url)
        //console.log(all_teams.TeamPlayers)
        const users_team = all_teams.TeamPlayers.filter(team => team.Players.filter(player => player.Name == user_name)[0] )[0]
        const team_user_stats = users_team.Players.filter(user => user.Name == user_name)[0]
        console.log(users_team)
        if(!users_team){
            //msg.delete()
            return message.channel.send('Could not find user')
        }


        const matches_url = 'https://vrmasterleague.com/Services.asmx/GetMatchesThisWeek?game=echoarena&max=100'
        const matches = await doRequest(matches_url)
        const users_team_matches = matches.filter(match => match.HomeTeam == users_team.Name || match.AwayTeam == users_team.Name)
        


        const embed = new Discord.MessageEmbed()
        embed.setColor('#0099ff')
        embed.setTitle(user_name)
        //embed.setAuthor(stats.DivisionName, stats.DivisionLogo)
            
        //embed.setThumbnail(logos[0].Logo)
        embed.setDescription(team_user_stats.Nationality)
        
        users_team_matches.forEach(users_team_match => {

            embed.addFields(
                { name: users_team_match.DateScheduled, value: `${users_team_match.HomeTeam} vs ${users_team_match.AwayTeam}`, inline: true },
            )
        });
        
            
            //.setTimestamp()
            
        
        message.channel.send(embed);
        //msg.delete()

    }*/

}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    perms: [

    ]
};
  
const path = require("path")
exports.help = {
    category: __dirname.split(path.sep).pop(),
    name:"vrml",
    description: "Returns vrml stats",
    usage: "!vrml team [team]"
};