const fs = require('fs');

module.exports = {
	name: 'deleteclock',
	args: true,
	guildOnly: true,
	description: 'Turn a voice channel back into a normal voice channel.',
	execute(client, message, logger, args) {
		const cronName = `updateTime.${message.guild.id}.${args[0]}`
		
		if (fs.existsSync(`./cronjobs/${cronName}.js`)){
			fs.unlinkSync(`./cronjobs/${cronName}.js`);
			
			return message.reply(`the clock has been smashed.`);
		}
		
		message.reply(`there doesn't seem to be an active clock matching that ID.`);
	}
};