const Discord = require("discord.js")
	, fs = require("fs")
	, gm = require("gm")
	, mod_roles = require("config").get("discord").get("mod_roles")
	, prefix = require("config").get("discord").get("prefix")
	, request = require("request")
	, xivvi_db = require("config").get("common").get("database");

module.exports = async (client, logger, message) => {
	if (message.guild) {
		message.guild.fetchMember(message.author.id).catch((e) => {
			message.guild.fetchMember(message.author.id).catch(e => {});
		}); // An attempt to make things work more often.
	}
	
	// ??
	if (message.content.indexOf(`┻━`) !== -1) {
		message.channel.send(`┬──┬*ﾉ(° -°ﾉ)`);
	} else if(message.content.toLowerCase() === "pepega") {
		message.delete();
		return message.channel.send(`<:pepega:582431754451943434>`);
	}
	
	// Verification
	if (message.channel.name === 'welcome') {
		if (!message.guild.members.find(mem => mem.id === message.author.id).roles.some(roles => mod_roles.includes(roles.name))) {
			message.delete();
		}
	}
	
	// Attachment processing
	if (message.attachments.size > 0) {
		message.attachments.forEach((value, key, map) => {
			const justFilename = value.filename.substr(0, value.filename.lastIndexOf('.'));
			const fileExtension = value.filename.substr(value.filename.lastIndexOf('.') + 1).toLowerCase();
			
			if (fileExtension === `bmp`) { // BMP files don't automatically render in Discord
				logger.log('info', `Got BMP file ${value.url} from ${message.author.tag}, processing...`)
				
				const before = new Date();
				
				request(value.url).on('error', (err1) => { // Get image from URL
					logger.log('error', `Couldn't GET ${value.url}, ignoring (${err1}).`);
				}).pipe(fs.createWriteStream(`temp/${value.filename}`)).on('finish', () => { // Save
					gm(`${__dirname}\\..\\temp\\${value.filename}`).write(`${__dirname}\\..\\temp\\${justFilename}.png`, (err2) => { // Convert
						if (err2) logger.log('error', err2);
						
						message.delete();
						
						message.channel.send(`${message.author}: Your file has been automatically converted from BMP to PNG (BMP files don't render automatically).`,
												new Discord.Attachment(`temp/${justFilename}.png`)).then((msg) => { // Send
							logger.log('info', `Processed BMP from ${message.author.tag} (t=${new Date().getTime() - before.getTime()}ms)!`);
						
							fs.unlink(`temp/${value.filename}`, (err3) => { // Delete original
								if (err3) logger.log('error', err3);
							});
							fs.unlink(`temp/${justFilename}.png`, (err3) => { // Delete converted
								if (err3) logger.log('error', err3);
							});
						});
					});
				});
			}
		});
	}
	
	// Command handler
	if (!message.content.startsWith(prefix)) return; // Don't execute code past this point if the message is not a command

	const args = message.content.slice(prefix.length).split(/\s/g); // Cut off the prefix, separate command into words
	const commandName = args.shift().toLowerCase(); // cAmEl CaSe Is GoOd CiViLiZaTiOn
	
	client.db.connect(`mongodb://localhost:27017/`, { useNewUrlParser: true }, (err, db) => {
		if (err) throw err;
		
		var dbo = db.db(xivvi_db);
		
		dbo.collection("disabledCommands").findOne({ guild: message.guild.id }, (err, res) => { // Check if an entry exists.
			if (res && res.disabledCommands && res.disabledCommands.includes(commandName)) return; // Return if the command is disabled.
			
			const command = client.commands.get(commandName)
				|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return; // If the command isn't a known command or command alias then return
			
			logger.log('info', `${message.guild.name}: ${message.author.tag}: ${message}`);
			
			if (command.guildOnly && message.channel.type !== 'text') { // If a guild command is used outside of a guild
				return message.reply('I can\'t execute that command inside DMs!');
			} else if (command.noGuild && message.channel.type === 'text') { // If a non-guild command is used in a guild
				message.delete();
				return message.reply(`please only use that command in DMs.`).then((m) => m.delete(5000));
			}
			
			if (command.guild && command.guild !== message.guild.name) return; // If a guild-specific command is used outside of that guild, do nothing.
			
			if (command.args && !args.length) { // Command that requires args is entered without args
				let reply = `You didn't provide any arguments, ${message.author}!`;

				if (command.usage) {
					reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
				}

				return message.channel.send(reply);
			}
			
			if (!client.cooldowns.has(command.name)) {
				client.cooldowns.set(command.name, new Discord.Collection());
			}

			const now = Date.now();
			const timestamps = client.cooldowns.get(command.name);
			const cooldownAmount = (command.cooldown || 0) * 1000;

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before using the \`${command.name}\` command.`);
				}
			}
			
			timestamps.set(message.author.id, now); // Remove a command from the cooldown list if for whatever reason it hasn't automatically been removed
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
			
			try {
				command.execute(client, message, logger, args); // Use the command
			} catch (e) {
				logger.log('error', `Error ${e} in command ${prefix}${command.name}, used by ${message.guild.name}: ${message.author.tag}. Printing stack trace: ${e.stack}`);
			}
		});
	});
};