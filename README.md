# (Big WIP) Xivvi

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/77d511b3bd694eb1bb086e9252985b4e)](https://app.codacy.com/app/karashiiro/Xivvi?utm_source=github.com&utm_medium=referral&utm_content=karashiiro/Xivvi&utm_campaign=Badge_Grade_Dashboard)

(WIP) A production version of Prima. Less efficient and more stable.

Scroll down to installation if you want to host it yourself. I'd actually prefer you host it yourself so I don't need to handle your data or add load to my one server (a laptop under the TV), but if you can't host it yourself you can use the link below.

## Adding Xivvi to Your Discord Server
This is the easy way to use Xivvi, just click [this link](https://discordapp.com/api/oauth2/authorize?client_id=582785047371841537&permissions=0&scope=bot) to add Xivvi to your server and then follow the other directions:

Create a channel called `#bot-stuff` for Xivvi to post random data to, and make sure you have a role called "Moderator".

Create a channel called `#reports` to handle that stuff, or disable the command with `~disable report` if you have another bot doing that already.

### User Commands
`~map <mapname>` - Sends a zone map.

`~flag <x> <y> <mapname>` - Sends a zone map with a flag at (x, y).

`~whatisthis` - Posts the detailed channel description set by `~setdescription` in chat.

`~report <report text>` - (WIP) Reports something to `#reports`.

`~iam <world> <name> <surname>` - Links an FFXIV character to your Discord account. This can be changed at any time.

`~whoami` - Outputs stored `~iam` data.

`~roll <args>` - Rolls dice??

`~teamcraft` - Use the Teamcraft simulator.

### Administrative Commands
`~enable <commandname>` - Enables a command.

`~disable <commandname>` - Disables a command.

`~addclock <voice channel ID> <Linux-formatted timezone> [Timezone code]` - Turns a voice channel into a clock. Timezones are listed under "TZ database name" [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). You can optionally pass a custom timezone code (such as PST, GMT, ST, etc.) to be displayed instead of the default timezone code.

`~deleteclock <voice channel ID>` - Smashes a clock.

`~setdescription <description>` - Set a description for a channel that can then be called by anyone with `~whatisthis`.

`~addrole <mention> <role>` - Adds a role to a user. Somewhat obsolete thanks to Discord adding mobile role assignment.

`~removerole <mention> <role>` - Removes a role from a user.

`~cyclical <cronstring> <message>` - Repeatedly sends a message in a channel, at the frequency described in the cronstring. Seconds are not optional, set them to 0 if you want the message to show on the minute. Cronstring information is available [here](https://www.npmjs.com/package/node-cron). Using `~cyclical stop` ends the repetition.

`~when <mention>` - See when a user joined Discord. Potentially useful for detecting alts and spammers.

`~statsout [-g]` - Outputs stored population statistics, collected every server midnight. Using the `-g` toggle outputs a graph instead.

### Bot Admin Commands
`~reloadcommand <commandname>` - Reloads a command from its file.

`~reloadevent <eventname>` - Reloads an event from its file.

`~reloadcron <cronname>` - Reloads a CronJob from its file.

`~listcron` - List all running CronJobs.

`~unloadcron <cronname>` - Unload a CronJob.

## Installation
(WIP)

If you want to host a copy of Xivvi yourself, it's a little more involved. First, get a bot token from the [Discord Developer Portal](https://discordapp.com/developers/docs/intro) as described in "Getting Started" [here](https://www.howtogeek.com/364225/how-to-make-your-own-discord-bot/), and install [Node.js](https://nodejs.org/en/), version 10 or higher. Also get yourself your four access keys from Twitter's REST API if you want to use the Twitter subscribe function. You also need to install [Graphicsmagick](http://www.graphicsmagick.org/) and [MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/), version 4.2 or higher.

To add the bot to your server, follow the directions under "How to Add the Bot to Your Server" on the [HowToGeek guide](https://www.howtogeek.com/364225/how-to-make-your-own-discord-bot/).

To run the server, just run the following commands using Command Prompt or Terminal in the install directory:

`npm install`

`node .`

### Configuration
`common.bot_admin` should be your Discord ID.

`discord.prefix` is the command prefix.

`discord.token` is your bot token.

`discord.status_channel` is the channel you want Xivvi to tell you startup information and errors in.

`discord.report_channel` is the channel you want Xivvi to send user reports to. This isn't required if you `~disable report`.

`discord.mod_roles` is an array of roles that can use the administrative commands like `~bulkdelete` etc.

`twitter.consumer_key`, along with the other three keys below, are your Twitter access tokens.

`twitter.consumer_secret`

`twitter.access_token`

`twitter.access_secret`
