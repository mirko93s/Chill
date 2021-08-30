const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_VOICE_STATES', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGES', 'GUILD_PRESENCES', 'GUILD_INVITES'] });
client.serverstatscooldown = new Set();
client.queue = new Map();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");
//load commands
["command"].forEach(handler => {
  	require(`./handler/${handler}`)(client);
});
//load events
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		const eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

client.login(require('./config.json').token);