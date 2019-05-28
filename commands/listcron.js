const bot_admin = require('config').get('common').get('bot_admin')
	, commontags = require('common-tags')
	, cronJob = require('cron').CronJob;

module.exports = {
	name: 'listcron',
	guildOnly: true,
	description: `Lists all running CronJobs (Bot admin only).`,
	execute(client, message, logger, args) {
		// Check if Admin
		if (message.member.id !== bot_admin) return;
		
		let res = ``;
		
		for (job of client.cronJobs) {
			res += `${job[0]}\n`
		}
		
		message.channel.send(commontags.stripIndents`
			Active CronJobs:
			${res}
		`);
	}
}