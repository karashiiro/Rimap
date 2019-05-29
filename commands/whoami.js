const config = require("config")
	, disConfig = config.get("discord")
	, Discord = require("discord.js")
	, XIVAPI = require("xivapi-js")
	, xiv = new XIVAPI({private_key: config.get("xivapi.api_key"), language: "en"})
	, xivvi_db = require("config").get("common.database");

module.exports = {
	name: "whoami",
	execute(client, message, logger, args) {
		message.guild.fetchMember(message.author.id).catch((e) => {});
		
		const dbURL = `mongodb://localhost:27017/`;
		
		client.db.connect(dbURL, { useNewUrlParser: true }, (err, db) => {
			if (err) throw err;
			
			var dbo = db.db(xivvi_db);
			
			dbo.collection("xivcharacters").findOne({ id: message.author.id }, (err, res) => {
				if (!res) return message.reply(`you don't seem to have registered your character yet. Register your character with \`~iam World Name Surname\`.`);
				
				if (!res.avatar) {
					xiv.character.search(res.name, { server: res.world }).then((response, err) => {
						const character = response.Results[0] // First result is probably the best result.
						
						const output = new Discord.RichEmbed()
							.setColor('#0080ff')
							.setTitle(`(${res.world}) ${res.name}`)
							.setThumbnail(character.Avatar);
						
						message.channel.send(output);
						
						dbo.collection("xivcharacters").updateOne({ id: message.author.id }, { $set: { world: character.Server, name: character.Name, lodestone: character.ID, avatar: character.Avatar } }, (err, res) => { // Update if existing.
							if (err) throw err;
							
							logger.log('info', `${xivvi_db}: Updated ${message.author.id}: ${character.Avatar}`);
							
							db.close();
						});
					});
				} else {
					const output = new Discord.RichEmbed()
						.setColor('#0080ff')
						.setTitle(`(${res.world}) ${res.name}`)
						.setThumbnail(res.avatar);
					logger.log('info', `Whoami answered.`);
					message.channel.send(output);
				}
			});
		});
	}
}