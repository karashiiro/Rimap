const config = require('config')
	, disConfig = config.get('discord');

module.exports = {
	name: 'disable',
	description: `Disables a command (Administrators only).`,
	args: true,
	execute(client, message, logger, args) {
		// Check if Administrator
		if (!message.member.roles.some(roles => disConfig.get('mod_roles').includes(roles.name))) return;
		
		const commandName = args[0];
		const dbURL = `mongodb://localhost:27017/`;
		
		client.db.connect(dbURL, { useNewUrlParser: true }, (err, db) => {
			if (err) throw err;
			
			var dbo = db.db("xivvi_db");
			var documentData = { guild: message.guild.id, disabledCommands: [commandName] };
			
			dbo.collection("disabledCommands").findOne({ guild: message.guild.id }, (err, res) => { // Check if an entry exists.
				if (res) {
					res.disabledCommands.push(commandName);
					
					dbo.collection("disabledCommands").updateOne({ guild: message.guild.id }, { $set: { disabledCommands: res.disabledCommands } }, (err, res) => { // Update if existing.
						if (err) throw err;
						
						logger.log('info', `xivvi_db: Updated ${message.guild.id} disabled commands: ${commandName}`);
						message.reply(`Added ${commandName} to the disabled command list.`);
						
						db.close();
					});
				} else {
					dbo.collection("disabledCommands").insertOne(documentData, (err, res) => { // Create if nonexistent.
						if (err) throw err;
						
						logger.log('info', `xivvi_db: Updated ${message.guild.id} disabled commands: ${commandName}`);
						message.reply(`Added ${commandName} to the disabled command list.`);
						
						db.close();
					});
				}
			});
		});
	}
}