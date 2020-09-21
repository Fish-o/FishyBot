var fs = require("fs");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;
module.exports = (client) => {
    client.recache()
    client.sendinfo('Bot gone online')
	console.log('I am ready to serve you!');
	client.user.setStatus('online');
	client.user.setActivity('f!help');
};


exports.conf = {
    event: "ready"
};