# Xivvi
(WIP) A production version of Prima. Less efficient, more stable, more secure.

# Adding Xivvi to Your Discord Server
This is the easy way to use Xivvi, just click the link below to add Xivvi to your server and then follow the other directions:

No link here yet.

Create a channel called `#bot-stuff` for Xivvi to post random data to, and make sure you have a role called "Moderator".

Create a channel called `#reports` to handle that stuff, or disable the command with `~disable report` if you have another bot doing that already.

# General Commands
`~enable <commandname>` - Enables a command.

`~disable <commandname>` - Disables a command.

`~addclock <voice channel ID> <Linux-formatted timezone>` - Turns a voice channel into a clock. Timezones are listed under "TZ database name" [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

`~deleteclock <voice channel ID>` - Smashes a clock.

`~setdescription <description>` - Set a description for a channel that can then be called by anyone with `~whatisthis`.

`~whatisthis` - Post the description in chat.

`~addrole <mention> <role>` - Adds a role to a user. Somewhat obsolete thanks to Discord adding mobile role assignment.

`~removerole <mention> <role>` - Removes a role from a user.

`~report <report text>` - Reports something to `#reports`.

`~cyclical <cronstring> <message>` - Repeatedly sends a message in a channel, at the frequency described in the cronstring. Seconds are not optional, set them to 0 if you want the message to show on the minute. Cronstring information is available [here](https://www.npmjs.com/package/node-cron). Using `~cyclical stop` ends the repetition.

`~when <mention>` - See when a user joined Discord. Potentially useful for detecting alts and spammers.

# Bot Admin Commands
`~reloadcommand <commandname>` - Reloads a command from its file.

`~reloadevent <eventname>` - Reloads an event from its file.

`~reloadcron <cronname>` - Reloads a CronJob from its file.

`~listcron` - List all running CronJobs.

`~unloadcron <cronname>` - Unload a CronJob.

# Installation
(WIP)

If you want to host a copy of Xivvi yourself, it's a little more involved. First, get a bot token from the [Discord Developer Portal](https://discordapp.com/developers/docs/intro) and install [Node.js](https://nodejs.org/en/). Also get yourself your four access keys from Twitter's REST API.

There's a fair number of commands to be run to install the node.js dependencies into your Xivvi folder, listed below:

`npm init` - Hit enter until it asks for your project file (default: index.js) and then set that to xivvi.js.

`npm i common-tags`

`npm i config`

`npm i cron`

`npm i discord.js`

`npm i gm` - You also need to install [Graphicsmagick.](http://www.graphicsmagick.org/)

`npm i moment`

`npm i moment-timezone`

`npm i mongodb` - Also install [MongoDB.](https://docs.mongodb.com/manual/administration/install-community/)

`npm i twitter`

`npm i winston`

`npm i winston-daily-rotate-file`

# Configuration
`common.bot_admin` should be your Discord ID.

`discord.prefix` is the command prefix.

`discord.token` is your bot token.

`discord.status_channel` is the channel you want Xivvi to tell you random information in.

`discord.report_channel` is the channel you want Xivvi to send user reports to.

`discord.mod_roles` is an array of roles that can use the administrative commands like `~bulkdelete` etc.

`twitter.consumer_key`, along with the other three keys below, are your Twitter access tokens.

`twitter.consumer_secret`

`twitter.access_token`

`twitter.access_secret`
