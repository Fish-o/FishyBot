module.exports = async (client, error) => {
    client.sendinfo('An error has occured')
    client.sendinfo(JSON.stringify(error))
    client.logger.log(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`, "error");
};