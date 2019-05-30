const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
	name: "map",
	args: true,
	execute(client, message, logger, args) {
		fs.readdir("./assets/xivmaps", (err, files) => {
			if (err) throw err;
			
			files = files.filter((fileName) => fileName.endsWith(".png"));
			
			const mapName = files.find((fileName) => fileName === args.join(" ").toLowerCase() + ".png");
			
			if (!mapName) {
				return message.reply("there's no map with that name!");
			}
			
			message.channel.send(
				new Discord.Attachment(
					"./assets/xivmaps/" + mapName
				)
			);
		});
	}
};