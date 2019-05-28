// Check every six hours if there's a new post from @PopTartADay
const { Attachment } = require("discord.js")
	, config = require("config")
	, fs = require("fs")
	, tweetConfig = config.get("twitter")
	, twitter = require("twitter");

module.exports = {
	cronstring: "0 */6 * * *",
	execute(client, logger) {
		var twitterClient = new twitter({
			consumer_key: tweetConfig.get("consumer_key"),
			consumer_secret: tweetConfig.get("consumer_secret"),
			access_token_key: tweetConfig.get("access_token"),
			access_token_secret: tweetConfig.get("access_secret")
		});
		
		fs.readFile("./PopTartADay.txt", (err1, url) => {
			if (err1) throw err1;
			
			url = url.toString();
			
			twitterClient.get('search/tweets', { q: 'from:PopTartADay', result_type: 'recent', count: '1' }, (err2, tweet, response) => {
				if (err2) throw err2;
				
				const new_url = tweet.statuses[0].extended_entities.media[0].media_url;
				const media = new Attachment(new_url);
				
				if (url.indexOf(new_url) !== -1) {
					return;
				} else {
					client.guilds.forEach((value, key, map) => {
						var victimChannel = value.channels.find(ch => ch.name === "general");
						victimChannel.send(`Here is your daily dose of poptart:`).then(() => {
							victimChannel.send(media);
						});
					});
					
					fs.appendFile("./PopTartADay.txt", `${new_url}\n`, (err3) => {
						if (err3) throw err3;
					});
				}
			});
		});
	}
};