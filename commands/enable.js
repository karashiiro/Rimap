const config = require("config")
	, disConfig = config.get("discord")
	, xivvi_db = require("config").get("common").get("database");

module.exports = {
	name: 'disable',
	description: `Disables a command (Administrators only).`,
	args: true,
	execute(client, message, logger, args) {
		// Check if Administrator
		if (!message.member.roles.some((roles) => disConfig.get('mod_roles').includes(roles.name))) return;
		
		const commandName = args[0];
		const dbURL = `mongodb://localhost:27017/`;
		
		client.db.connect(dbURL, { useNewUrlParser: true }, (err, db) => {
			if (err) throw err;
			
			var dbo = db.db(xivvi_db);
			var documentData = { guild: message.guild.id, disabledCommands: [commandName] };
			
			dbo.collection("disabledCommands").findOne({ guild: message.guild.id }, (err, res) => { // Check if an entry exists.
				if (res && res.disabledCommands) {
					if (!res.disabledCommands.includes(commandName)) return message.reply(`that command isn't disabled.`);
					
					res.disabledCommands.splice(res.disabledCommands.indexOf(commandName), 1);
					
					dbo.collection("disabledCommands").updateOne({ guild: message.guild.id }, { $set: { disabledCommands: res.disabledCommands } }, (err, res) => { // Update if existing.
						if (err) throw err;
						
						logger.log('info', `${xivvi_db}: Updated ${message.guild.id} enabled commands: ${commandName}`);
						message.reply(`Removed ${commandName} from the disabled command list.`);
						
						db.close();
					});
				} else {
					return message.reply(`no commands are disabled.`);
				}
			});
		});
	}
};