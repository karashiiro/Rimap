const moment = require('moment');

module.exports = {
	cronstring: "* * * * *",
	execute(client, logger) {
		try { client.guilds.get("582809462293921793"); } catch(e) {}
		
		const clocks = ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'];
		const halfHourClocks = ['🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'];
		var timeChannel = client.guilds.get("582809462293921793").channels.find(ch => ch.id === "582811342889549824");
		
		var now = moment.tz("America/Los_Angeles");
		
		var minute = parseInt(now.format('m'));
		
		var hour = parseInt(now.format('h'));
		
		var clockEmoji = minute < 30 ? clocks[hour - 1] : halfHourClocks[hour - 1];
		
		timeChannel.setName(clockEmoji + " " + now.format("h:mm A zz"));
	}
};