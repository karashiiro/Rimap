const config = require('config')
	, disConfig = config.get('discord');

module.exports = async (client, logger, oldUser, newUser) => {
	if (oldUser.tag === newUser.tag) return;
	
	client.guilds.forEach((value, key, map) => {
		var statusChannel = value.channels.find(ch => ch.name === disConfig.get('status_channel'));
		statusChannel.send(`User ${oldUser.tag} changed their username to ${newUser.tag}.`);
	});
	
	logger.log('warn', `User ${oldUser.tag} changed their username to ${newUser.tag}.`);
}