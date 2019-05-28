const commontags = require('common-tags')
	, config = require('config')
	, disConfig = config.get('discord');

module.exports = {
	name: 'report',
	args: true,
	noGuild: true,
	cooldown: 5,
	description: `Report something to the Administrators.`,
	execute(client, message, logger, args) {
		var report = ''; // Report is the rest of the arguments, we loop through them
		for(var i = 0; i < args.length; i++) {
			report += args[i] + ' ';
		}
		report = report.substr(0, report.length - 1); // Lazy coding to remove the space at the end
		
		// Figure out which guild they're in
		var guild;
		client.guilds.forEach((value, key, map) => {
			try {
				value.fetchMember(message.author.id);
				if (!guild) {
					guild = value;
				} else { // Multiple guilds with Rimap?
					// TODO
				}
			} catch(error) {
				guild = undefined;
			}
		});
		
		try {
			reportChannel = guild.channels.find((ch) => ch.name === disConfig.get('report_channel'));
			reportChannel.send(`${guild.roles.find((r) => r.name === disConfig.get('mod_roles')[2])} ${message.author.tag} just sent a report: ${report}`);
			
			message.channel.send(`Thank you for your report. The moderators will read it as soon as they are available.`);
		} catch(error) {
			message.channel.send(commontags.stripIndents`
				...Something went wrong and I couldn't figure out which guild to send that report to.
				If you're so inclined, please send your report directly to a Moderator or Administrator.
			`);
			
			logger.log('error', `Failed to send a report to guild ${guild}: ${error}`);
		}
	}
};