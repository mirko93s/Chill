const Discord = require('discord.js');
const client = new Discord.Client({ intents: [
	'GUILDS',
	'GUILD_MEMBERS',
	'GUILD_BANS',
	'GUILD_EMOJIS_AND_STICKERS',
	'GUILD_VOICE_STATES',
	'GUILD_PRESENCES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
	'DIRECT_MESSAGES',
	'GUILD_WEBHOOKS'
	],
	partials: [
		'MESSAGE',
		'REACTION'
	]
});
client.serverstatscooldown = new Set();
client.queue = new Map();
client.slashs = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
// load modules
client.chill = require('./handlers/module.js');
client.chill.setupDatabases(client);
// load handlers
['command','event'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
client.login(require('./config.json').token);