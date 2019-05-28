const config = require("config")
	, cronJob = require("cron").CronJob
	, Discord = require("discord.js")
	, disConfig = config.get("discord")
	, fs = require("fs")
	, MongoClient = require("mongodb").MongoClient
	, winston = require("winston");
require("winston-daily-rotate-file");

//
// MAIN OBJECT INIT
//

// Folder creation

if (!fs.existsSync("temp")) { // This is where BMP files are kept temporarily
	fs.mkdirSync("temp");
}

if (!fs.existsSync("stats")) { // Server stats
	fs.mkdirSync("stats");
}

if (!fs.existsSync("helpfiles")) { // Channel descriptions for ~whatisthis
	fs.mkdirSync("helpfiles");
}

// Logging

const rotatingTransport = new winston.transports.DailyRotateFile({ // Def rotating log
	filename: "logs/xivvi-%DATE%.log",
	datePattern: "YYYY-MM-DD-HH",
	maxSize: "50m"
});

const logger = winston.createLogger({ // Start winston logging
	transports: [
		new winston.transports.Console(),
		rotatingTransport
	],
	format: winston.format.combine(
		winston.format.timestamp({
		  format: 'HH:mm:ss'
		}),
		winston.format.printf(log => `[${log.timestamp}][${log.level.toUpperCase()}] - ${log.message}`),
	),
});

// Discord

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.cronJobs = new Discord.Collection();

client.cooldowns = new Discord.Collection(); // Make a collection of commands on cooldown, currently empty
client.db = MongoClient;

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); // Load command plugins
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js')); // Load event plugins
const cronFiles = fs.readdirSync('./cronjobs').filter(file => file.endsWith('.js')); // Load cron plugins

for(const file of commandFiles) { // Load command plugins
	const command = require(`./commands/${file}`);
	client.commands.set(file.substr(0, file.indexOf('.')), command);
}

for (const file of eventFiles) { // Load client events
	const clientEvent = require(`./events/${file}`);
	
	eventName = file.substr(0, file.indexOf('.'));
	client.on(eventName, clientEvent.bind(null, client, logger));
}

for (const file of cronFiles) { // Load cronjobs
	const cronEvent = require(`./cronjobs/${file}`);
	client.cronJobs.set(file, new cronJob(cronEvent.cronstring, () => cronEvent.execute(client, logger), null, true));
}

process.on('uncaughtException', error => logger.log('error', error)); // You should really be running this in a process manager, but this is here if you're not.

client.login(disConfig.get('token')); // Login