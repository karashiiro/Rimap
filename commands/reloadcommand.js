// https://anidiots.guide/first-bot/a-basic-command-handler
const bot_admin = require("config").get("common").get("bot_admin");

module.exports = {
	name: 'reloadcommand',
	guildOnly: true,
	description: `Reloads a command (Bot admin only).`,
	execute(client, message, logger, args) {
		// Check if Admin
		if (message.member.id !== bot_admin) return;
		
		if (!args || args.size < 1) return message.reply("Must provide a command name to reload.");
		
		const commandName = args[0];
		
		// the path is relative to the *current folder*, so just ./filename.js
		delete require.cache[require.resolve(`./${commandName}.js`)];
		
		// We also need to delete and reload the command from the client.commands Enmap
		client.commands.delete(commandName);
		const props = require(`./${commandName}.js`);
		client.commands.set(commandName, props);
		
		logger.log('info', `Command ${commandName} reloaded by ${message.author.tag}.`);
		message.reply(`the command ${commandName} has been reloaded!`);
	}
};