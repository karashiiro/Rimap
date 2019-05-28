const config = require('config')
	, disConfig = config.get('discord');

module.exports = async (client, logger, replayed) => {
	logger.log('info', `${replayed} events replayed.`);
	
	client.guilds.forEach((value, key, map) => {
		var statusChannel = value.channels.find(ch => ch.name === disConfig.get('status_channel'));
		statusChannel.send(`Reconnected.`);
	});
}