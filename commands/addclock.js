const commontags = require('common-tags')
	, config = require('config')
	, cronJob = require('cron').CronJob
	, disConfig = config.get('discord')
	, fs = require('fs');

module.exports = {
	name: 'addclock',
	description: `Turns a voice channel into a clock :clock1:`,
	args: true,
	guildOnly: true,
	execute(client, message, logger, args) {
		message.delete();
		
		const mod_roles = disConfig.get('mod_roles');
		const status_channel = disConfig.get('status_channel');
		
		if (!message.member.roles.some((roles) => mod_roles.includes(roles.name))) return;
		
		const prefix = disConfig.get('prefix');
		const guildID = message.guild.id;
		const timezone = args[1].replace(/[^a-zA-Z_\/+0-9-]/g, "");
		const channel = args[0].replace(/[^a-zA-Z]/g, "");
		const cronName = `updateTime.${guildID}.${channel}`;
		
		var guild = client.guilds.get(guildID);
		var statusChannel = guild.channels.find((ch) => ch.name === status_channel);
		
		if (!args[0] || !args[1] || !parseInt(channel) || timezone.indexOf('/') === -1) {
			statusChannel.send(commontags.stripIndents`
				<@${message.author.id}>, one or more arguments were misformatted or nonexistent.
				Please try again, checking to make sure all arguments were entered correctly.
				Usage: \`${prefix}addclock <voice channel ID> <Linux-formatted timezone name>\`
			`);
		}
		
		if (!client.guilds.get(guildID).channels.find((ch) => ch.id === channel)) return;
		
		if (fs.existsSync(`./cronjobs/${cronName}.js`)){
			fs.unlinkSync(`./cronjobs/${cronName}.js`);
		}
		
		const cronScript = 
`const moment = require("moment");

module.exports = {
	cronstring: "* * * * *",
	execute(client, logger) {
		try { client.guilds.get("${guildID}"); } catch(e) {}
		
		const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
		const halfHourClocks = ['🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'];
		var timeChannel = client.guilds.get("${guildID}").channels.find((ch) => ch.id === "${channel}");
		
		var now = moment.tz("${timezone}");
		
		var minute = parseInt(now.format('m'));
		
		var hour = parseInt(now.format('h'));
		
		var clockEmoji = minute < 30 ? clocks[hour - 1] : halfHourClocks[hour - 1];
		
		timeChannel.setName(clockEmoji + " " + now.format("h:mm A zz")).catch((e) => {
			logger.log("error", "File updateTime.${guildID}.${channel}.js threw an error: " + e.toString());
		});
	}
};`;
		
		fs.appendFileSync(`./cronjobs/${cronName}.js`, cronScript);
		
		cronEvent = require(`../cronjobs/${cronName}.js`);
		client.cronJobs.set(cronName, new cronJob(cronEvent.cronstring, () => cronEvent.execute(client, logger), null, true)); // Start the new one.
		
		message.channel.send(`Clock ${timezone} added!`).then((m) => m.delete(3000));
	}
};
