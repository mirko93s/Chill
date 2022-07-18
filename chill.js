const { Collection, Client, GatewayIntentBits, Partials } = require(`discord.js`);
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildWebhooks,
	],
	partials: [
		Partials.Message,
		Partials.Reaction,
		Partials.Channel,
	],
});
client.serverstatscooldown = new Set();
client.queue = new Map();
client.slashs = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
// load modules
client.chill = require(`./handlers/module.js`);
client.chill.setupDatabases(client);
client.lang = require(`./handlers/language.js`);
// load handlers
[`command`, `event`, `errors`].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});
client.login(require(`./config.json`).token);