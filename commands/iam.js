const config = require("config")
	, disConfig = config.get("discord")
	, Discord = require("discord.js")
	, XIVAPI = require("xivapi-js")
	, xiv = new XIVAPI({private_key: config.get("xivapi.api_key"), language: "en"})
	, xivvi_db = require("config").get("common.database");

module.exports = {
	name: "iam",
	cooldown: 0.05,
	description: `Links a character to your Discord account.`,
	args: true,
	execute(client, message, logger, args) {
		if (message.guild) message.guild.fetchMember(message.author.id).catch((e) => {}); // An attempt to make it work more often.
		message.delete().catch((e) => {});
		
		if (args.length !== 3) return message.reply(`please enter that command in the format \`${config.get("common.prefix")}iam World Name Surname\`.`).then((msg) => msg.delete(5000));
		
		var world = args[0];
		var name = args[1] + " " + args[2]; // Used for the initial query.
		
		const dbURL = `mongodb://localhost:27017/`;
		
		xiv.character.search(name, { server: world }).then((res, err) => {
			const character = res.Results[0] // First result is probably the best result.
			
			world = character.Server; // Reassigned to ensure proper formatting.
			name = character.Name; // ("")
			
			const output = new Discord.RichEmbed()
				.setColor('#0080ff')
				.setTitle(`(${world}) ${name}`) // (World) Name Surname
				.setDescription(`Query matched!`)
				.setThumbnail(character.Avatar);
			
			client.db.connect(dbURL, { useNewUrlParser: true }, (err, db) => {
				if (err) throw err;
				
				var dbo = db.db(xivvi_db);
				var documentData = { id: message.author.id, world: world, name: name, lodestone: character.ID, avatar: character.Avatar };
				
				dbo.collection("xivcharacters").findOne({ lodestone: character.ID }, (err, res) => {
					if (res && res.id !== message.author.id) return message.reply(`someone else has already registered that character.`).then((m) => m.delete(5000));
					
					dbo.collection("xivcharacters").findOne({ id: message.author.id }, (err, res) => { // Check if an entry exists.
						if (res) {
							dbo.collection("xivcharacters").updateOne({ id: message.author.id }, { $set: { world: world, name: name, lodestone: character.ID, avatar: character.Avatar } }, (err, res) => { // Update if existing.
								if (err) throw err;
								
								logger.log('info', `${xivvi_db}: Updated ${message.author.id}: (${world}) ${name}`);
								
								db.close();
							});
						} else {
							dbo.collection("xivcharacters").insertOne(documentData, (err, res) => { // Create if nonexistent.
								if (err) throw err;
								
								logger.log('info', `${xivvi_db}: Updated ${message.author.id}: (${world}) ${name}`);
								
								db.close();
							});
						}
						
						message.channel.send(output).then((msg) => msg.delete(10000));
					});
				});
			});
		}).catch((err) => {
			logger.log('error', err);
			message.reply(err).then(m => m.delete(5000));
		});
	}
}