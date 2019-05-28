const bot_admin = require('config').get('common').get('bot_admin')
	, cronJob = require('cron').CronJob;

module.exports = {
	name: 'unloadcron',
	guildOnly: true,
	description: `Unloads a CronJob (Bot admin only).`,
	execute(client, message, logger, args) {
		// Check if Admin
		if (message.member.id !== bot_admin) return;
		
		if (!args || args.size < 1) return message.reply("Must provide a CronJob name to unload.");
		
		const cronName = args[0];
		
		delete require.cache[require.resolve(`../cronjobs/${cronName}.js`)]; // Remove from require cache
		
		if (client.cronJobs.has(cronName)) {
			client.cronJobs.get(cronName).stop(); // Stop the existing job.
			client.cronJobs.delete(cronName);
			
			logger.log('info', `CronJob ${cronName} has been stopped by ${message.author.tag}`);
			message.reply(`the CronJob ${cronName} has been unloaded!`);
			
			return;
		}
		
		message.reply(`that isn't an active CronJob!`);
	}
}