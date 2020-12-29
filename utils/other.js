const Discord = require('discord.js');
const fs = require('fs');
function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}
function jsUcfirst(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




exports.getMember = function(message, toFind = '') {
    toFind = toFind.toLowerCase();
    let target = message.guild.members.cache.get(toFind);
    if (!target && message.mentions.members)
        target = message.mentions.members.first();
    if (!target && toFind) {
        target = message.guild.members.find(member => {
            return member.displayName.toLowerCase().includes(toFind) ||
            member.user.tag.toLowerCase().includes(toFind)
        });
    }    
    if (!target) 
        target = message.member;
        
    return target;

}


