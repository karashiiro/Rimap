const commontags = require('common-tags')
	, config = require('config')
	, disConfig = config.get('discord');

module.exports = {
	name: 'addrole',
	args: true,
	guildOnly: true,
	description: `Adds a role to a user.`,
	execute(client, message, logger, args) {
		function getUserFromMention(mention) {
			if (!mention) return;

			if (mention.startsWith('<@') && mention.endsWith('>')) {
				mention = mention.slice(2, -1);

				if (mention.startsWith('!')) {
					mention = mention.slice(1);
				}

				return mention;
			}
		}

		
		if (!message.member.roles.some(roles => disConfig.get('mod_roles').includes(roles.name))) return;
		
		message.delete();
		
		var userID = getUserFromMention(args.shift());
		var roleName = args.join(" ");
		
		var guild = client.guilds.get(message.guild.id);
		var statusChannel = guild.channels.find(ch => ch.name === disConfig.get('status_channel'));
		
		guild.members.find(mem => mem.id === userID)
		.addRole(guild.roles.find(role => role.name === roleName))
		.catch((error) => { // Maybe they were banned? Who knows why this would fail.
			statusChannel.send(commontags.stripIndents`
				<@${message.author.id}>, adding that role failed. This could be because of one of several factors, including but not limited to:
				:one: A bad user mention.
				:two: A misspelt role name.
				:three: My Discord client being slow.
				Please try again, checking to make sure all arguments were entered correctly.
				Usage: \`${disConfig.get('prefix')}addrole <mention> <role name>\`
			`);
		});
	}
}