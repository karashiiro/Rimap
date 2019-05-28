// Updates the server population statistics every day, starting from server join date.
const fs = require("fs");

module.exports = {
	cronstring: "0 0 * * *",
	execute(client, logger) {
		var counter = 0;
		
		client.guilds.forEach((value, key, map) => {
			counter++;
			
			const guild = value;
			const currentPopulation = guild.memberCount;
			
			const file = `stats/${guild.id}/population.txt`
			
			if (!fs.existsSync(`stats/${guild.id}/`)){
				fs.mkdirSync(`stats/${guild.id}/`);
			}
			
			fs.appendFile(file, `${currentPopulation},`, (err) => {
				if (err) throw err;
			});
		});
		
		logger.log("info", `Server statistics have been updated for ${counter} servers.`);
	}
};