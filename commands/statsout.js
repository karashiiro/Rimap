const fs = require('fs');
const commontags = require('common-tags');
const Discord = require('discord.js');

module.exports = {
	name: 'statsout',
	execute(client, message, logger, args) {
		fs.readFile(`stats/${message.guild.id}/population.txt`, (err1, dataSet) => {
			dataSet = dataSet.toString().match(/\d+/g);
			
			var numDays = dataSet.length;
			var netGain = dataSet[dataSet.length - 1] - dataSet[0];
			var avgDailyRate = Math.pow(dataSet[dataSet.length - 1] / dataSet[0], 1 / numDays) - 1;
			var parsedPercRate = `${avgDailyRate * 100}%`;
			var readableDailyRate = netGain / numDays;
			
			var stats = new Discord.RichEmbed() // Make the fancy panel like the one Meka has owo
				.setColor('#0080ff')
				.setTitle('Server Stats')
				.setDescription(commontags.stripIndents`
					Current population: ${dataSet[dataSet.length - 1]} users
					Net gain: ${netGain} users over ${numDays - 1} days (${numDays} data points)
					
					First data point: ${dataSet[0]} users
					Most recent data point: ${dataSet[dataSet.length - 1]} users
				`)
				.addField('Average Daily Growth Rate', `${parsedPercRate} (${readableDailyRate} users/day)`, true);
			
			message.channel.send(stats);
		});
	}
}