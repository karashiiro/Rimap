# Rimap
A production version of Prima.

# Adding Rimap to Your Discord Server
This is the easy way to use Rimap, just click the link below to add Rimap to your server and then follow the other directions:

No link here yet.

Create a channel called `#bot-stuff` for Rimap to post random data to.

# Installation
(WIP)

If you want to host a copy of Rimap yourself, it's a little more involved. First, get a bot token from the [Discord Developer Portal](https://discordapp.com/developers/docs/intro) and install [Node.js](https://nodejs.org/en/).

There's a fair number of commands to be run to install the node.js dependencies into your Rimap folder, listed below:

`npm init` - Hit enter until it asks for your project file (default: index.js) and then set that to rimap.js.

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

`discord.prefix` is the command prefix.

`discord.token` is your bot token.

`discord.status_channel` is the channel you want Rimap to tell you random information in.

`discord.report_channel` is the channel you want Rimap to send user reports to.

`discord.mod_roles` is an array of roles that can use the administrative commands like `~bulkdelete` etc.
