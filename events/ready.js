const config = require('config')
	, disConfig = config.get('discord');

module.exports = async (client, logger) => {
	// Bot setup
	logger.log('info', `Logged in as ${client.user.tag}!`);
	client.user.setPresence({ game: { name: `${disConfig.get('presences')[Math.floor(Math.random() * disConfig.get('presences').length)]}` } });
	client.syncGuilds();
	
	// Notify
	client.guilds.forEach((value, key, map) => {
		var statusChannel = value.channels.find(ch => ch.name === disConfig.get('status_channel'));
		statusChannel.send(`Bot loaded at ${new Date()}.`);
	});
}