const { Collection } = require('discord.js');
const Discord = require("discord.js");
const fs = require("fs");
// const config = require('./config.json');
const client = new Discord.Client;
client.queue = new Map();
client.commands = new Collection();
client.aliases = new Collection();
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