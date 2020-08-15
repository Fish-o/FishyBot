
module.exports = (client) => {
    client.sendinfo('Bot gone online')
	console.log('I am ready to serve you!');
	client.user.setStatus('online');
	//client.user.setActivity('type vr!help');
};