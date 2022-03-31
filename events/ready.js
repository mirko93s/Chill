const ascii = require(`ascii-table`);
const config = require(`../config.json`);
const package = require(`../package.json`);

module.exports = (client) => {
	client.chill.dashboard(client);
	console1337();
	client.chill.resumeIntervals(client);
	client.chill.npmCheckUpdates(); // check if dependencies are updated
	// define pm2 metrics
	const io = require(`@pm2/io`);
	const guilds_pm2_metric = io.metric({ name: `Guilds` });
	const users_pm2_metric = io.metric({ name: `Users` });
	const version_pm2_metric = io.metric({ name: `Version` });
	// get and format counters
	let users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0);
	users = client.chill.fancyNumber(users);
	let guilds = client.guilds.cache.size;
	guilds = client.chill.fancyNumber(guilds);
	// ensure all guilds in the db
	client.guilds.cache.forEach(guild => {
		client.chill.ensureGuildSettings(client, guild.id);
	});
	// set counters
	client.user.setActivity(`${users} user${users !== 1 ? `s` : ``}`, { type: `WATCHING` });
	// client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
	// client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${guilds}`);
	// set pm2 metrics
	guilds_pm2_metric.set(guilds);
	users_pm2_metric.set(users);
	version_pm2_metric.set(package.version);
	// update counters every 30 minutes
	setInterval(async () => {
		users = client.guilds.cache.reduce((a, g) => a + (g.memberCount || 0) - 1, 0);
		users = client.chill.fancyNumber(users);
		guilds = client.guilds.cache.size;
		guilds = client.chill.fancyNumber(guilds);
		// client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
		// client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${guilds}`);
		guilds_pm2_metric.set(guilds);
		users_pm2_metric.set(users);
		await client.user.setActivity(`${users} user${users !== 1 ? `s` : ``}`, { type: `WATCHING` });
		consolecounters(users, guilds);
	}, 30 * 60 * 1000);
};

function consolecounters(users, guilds) {
	const table = new ascii(`Counters`);
	table.setHeading(`Type`, `Number`);
	table.addRow(`Users`, users);
	table.addRow(`Guilds`, guilds);
	console.log(table.toString());
}

function console1337() {
	setTimeout(() => {
		console.log(`\n\x1b[33m\x1b[5m ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄  \x1b[0m                                         `);
	}, 1e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌          ▐░▌   \x1b[0m                                         `);
	}, 2e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌          ▐░▌   \x1b[0m                                         `);
	}, 3e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌   \x1b[0m                                         `);
	}, 4e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░▌          ▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌          ▐░▌   \x1b[0m                                         `);
	}, 5e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░▌          ▐░░░░░░░░░░░▌     ▐░▌     ▐░▌          ▐░▌            \x1b[0m\x1b[35m     ██╗██████╗     ██████╗ \x1b[0m`);
	}, 6e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░▌          ▐░█▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌          ▐░▌            \x1b[0m\x1b[35m    ███║╚════██╗   ██╔═████╗\x1b[0m`);
	}, 7e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░▌          ▐░▌       ▐░▌     ▐░▌     ▐░▌          ▐░▌            \x1b[0m\x1b[35m    ╚██║ █████╔╝   ██║██╔██║\x1b[0m`);
	}, 8e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░█▄▄▄▄▄▄▄▄▄ ▐░▌       ▐░▌ ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄   \x1b[0m\x1b[35m     ██║██╔═══╝    ████╔╝██║\x1b[0m`);
	}, 9e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌  \x1b[0m\x1b[35m     ██║███████╗██╗╚██████╔╝\x1b[0m`);
	}, 10e2);
	setTimeout(() => {
		console.log(`\x1b[33m\x1b[5m ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀   \x1b[0m\x1b[35m     ╚═╝╚══════╝╚═╝ ╚═════╝ \x1b[0m`);
	}, 11e2);
	setTimeout(() => {
		console.log(`\x1b[32m┬─┐┌─┐┌─┐┌┬┐┬ ┬\x1b[0m`);
	}, 12e2);
	setTimeout(() => {
		console.log(`\x1b[32m├┬┘├┤ ├─┤ ││└┬┘\x1b[0m`);
	}, 13e2);
	setTimeout(() => {
		console.log(`\x1b[32m┴└─└─┘┴ ┴─┴┘ ┴ \x1b[0m\n`);
	}, 14e2);
}