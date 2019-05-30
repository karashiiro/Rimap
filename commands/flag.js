const Discord = require('discord.js');
const fs = require('fs');
const gm = require('gm');
const xivvi = require('xivvi-common.js');

module.exports = {
	name: "flag",
	args: true,
	execute(client, message, logger, args) {
		//
		// Basic definitions
		//
		
		function getSquashedCoords(zoneName) {
			if (zoneName === "eureka anemos.png" ||
				zoneName === "eureka pagos.png"	 ||
				zoneName === "eureka pyros.png"  ||
				zoneName === "eureka hydatos.png") {
				return { x: 42, y: 42 };
			}
		};
		
		const MAPDIMS = {
			X: 586,
			Y: 585
		};
		
		const COST_THRESHOLD = 10;
		
		//
		// Basic input processing
		//
		
		var xHolder = args.shift().match(/\d+/g);
		var yHolder = args.shift().match(/\d+/g);
		
		if (!xHolder || !yHolder) {
			return message.reply("please enter that command in the format `~flag <x-coordinate> <y-coordinate> <map name>`.");
		}
		
		const X_COORD = parseFloat(xHolder[0] + "." + (xHolder[1] ? xHolder[1] : ""));
		const Y_COORD = parseFloat(yHolder[0] + "." + (yHolder[1] ? yHolder[1] : ""));
		
		if (isNaN(X_COORD) || isNaN(Y_COORD)) {
			return message.reply("please enter that command in the format `~flag <x-coordinate> <y-coordinate> <map name>`.");
		}
		
		//
		// Main logic
		//
		
		fs.readdir("./assets/xivmaps", (err, files) => {
			if (err) throw err;
			
			files = files.filter((fileName) => fileName.endsWith(".png"));
			
			// Try the easiest case first to save processing time
			var mapName = files.find((fileName) => fileName === args.join(" ").toLowerCase() + ".png");
			
			// If it doesn't match any file, we do a fuzzy string search to get what the user wanted
			if (!mapName) {
				// Get costs of all files compared to user input
				var nameSteps = new Map();
				for (file of files) {
					xivvi.levenshtein(args.join(" ").toLowerCase() + ".png", file, (cost) => {
						nameSteps.set(file, cost);
					});
				}
				
				// Get the cheapest file name
				var cheapest = [undefined, Number.MAX_SAFE_INTEGER];
				nameSteps.forEach((cost, fileName, map) => {
					if (cost < cheapest[1] && cost < COST_THRESHOLD) {
						cheapest[1] = cost;
						cheapest[0] = fileName;
					}
				});
				mapName = cheapest[0];
				
				// There were either no PNG files, or else the user's input was so butchered that nothing passed the cost threshold
				if (!mapName) {
					return message.reply("there's no map with that name!");
				}
			}
			
			// Place flag and send image
			var gameCoords = getSquashedCoords(mapName);
			
			gm(fs.readFileSync("./assets/xivmaps/" + mapName), mapName)
			.draw("image", "Over", ((X_COORD * MAPDIMS.X) / gameCoords.x) - 16, ((Y_COORD * MAPDIMS.Y) / gameCoords.y) - 16, 32, 32, __dirname + "\\..\\assets\\icons\\redflag.png")
			.write(__dirname + "\\..\\temp\\" + message.channel.id + mapName, (err) => {
				if (err) throw err;
				
				message.channel.send(
					new Discord.Attachment(
						"./temp/" + message.channel.id + mapName
					)
				).then((m) => {
					fs.unlink("./temp/" + message.channel.id + mapName, (err) => {
						if (err) throw err;
					});
				});
			});
		});
	}
};