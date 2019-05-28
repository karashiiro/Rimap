const bot_admin = require('config').get('common').get('bot_admin')
	, cronJob = require('cron').CronJob;

module.exports = {
	name: 'reloadcron',
	guildOnly: true,
	description: `Reloads a CronJob (Bot admin only).`,
	execute(client, message, logger, args) {
		// Check if Admin
		if (message.member.id !== bot_admin) return;
		
		if (!args || args.size < 1) return message.reply("Must provide a CronJob name to reload.");
		
		const cronName = args[0];
		
		delete require.cache[require.resolve(`../cronjobs/${cronName}.js`)]; // Remove from require cache
		
		if (client.cronJobs.has(cronName)) {
			client.cronJobs.get(cronName).stop(); // Stop the existing job.
		}
		
		cronEvent = require(`../cronjobs/${cronName}.js`);
		client.cronJobs.set(cronName, new cronJob(cronEvent.cronstring, () => cronEvent.execute(client, logger), null, true)); // Start the new one.
		
		logger.log('info', `CronJob ${cronName} has been reloaded by ${message.author.tag}.`);
		message.reply(`the CronJob ${cronName} has been reloaded!`);
	}
}