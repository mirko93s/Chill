const { Client, Util, Collection } = require('discord.js');
const Discord = require("discord.js");
const fs = require("fs");
const config = require('./config.json');
const client = new Discord.Client;
client.queue = new Map();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./xp_database/scores.sqlite');
const Enmap = require('enmap');
const talkedRecently = new Set();
const { xpAdd, setupCheck, dmOwnerOnJoin, welcomeMessage ,setupGuildOnJoin} = require("./functions.js");

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.settings = new Enmap({
	name: "settings",
	fetchAll: false,
	autoFetch: true,
	cloneLevel: 'deep'
  });

const defaultSettings = {
	prefix: ".",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true"
}

client.on('warn', console.warn);
client.on('error', console.error);
client.on('ready', () => {
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
  	if (!table['count(*)']) {
		sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run(); //create table if not exist
		sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();	// Ensure that the id row is always unique and indexed.
		sql.pragma("synchronous = 1");
		sql.pragma("journal_mode = wal");
  	}
	client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
	client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
	//set activity
	let users = client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)
	client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	//set channel counters in my server
	client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
	client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${client.guilds.cache.size}`);
	//update activity and counters every 30 minutes
	setInterval(async () => { 
		let users = client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)
		client.channels.cache.get(config.users_counter_channel).setName(`USERS: ${users}`);
		client.channels.cache.get(config.guilds_counter_channel).setName(`SERVERS: ${client.guilds.cache.size}`);
	  	await client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	  	console.log(`Bot activity UPDATED! New user size is: ${users}. New guild size is: ${client.guilds.cache.size}`);
	}, 30*60*1000);
});
client.on('disconnect', () => console.log('Chill BOT Disconnected! Trying to reconnect...'));
client.on('reconnecting', () => console.log('Chill BOT Reconnecting!'));

client.on('guildCreate', (guild) => {
	//add guild to db and set default values
	client.settings.ensure(guild.id, defaultSettings);
	setupGuildOnJoin(client, guild);
	console.log(`+ Guild: ${guild.name}`);
	let users = client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)
	client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	//msg guild owner with setup info
	dmOwnerOnJoin(client, guild);
});

client.on("guildDelete", guild => {
	console.log(`- Guild: ${guild.name}`)
	client.settings.delete(guild.id); //if a guild leaves, delete it from the settings db
});

client.on("guildMemberAdd", member => {
	member.roles.add(member.guild.roles.cache.find(role => role.id === client.settings.get(member.guild.id, "roleonjoin"))); //give default role to new members
	const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.id === (client.settings.get(member.guild.id, "welcomechannel")));
	if (!welcomechannel) return;
		else welcomechannel.send(welcomeMessage(member, member.guild)); //send welcome embed in welcome channel
});

client.on("voiceStateUpdate", (oldUser, newUser) => { //give temp role while on music voice channel
	const channel = newUser.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.id === (client.settings.get(newUser.guild.id, "musicvocalchannel")));
	const role = newUser.guild.roles.cache.find(role => role.id === (client.settings.get(newUser.guild.id, "musictemprole")));
	if (channel && role) {
		let newUserChannel = newUser.channel;
		if (newUserChannel === null) return newUser.member.roles.remove(role);
		if (newUserChannel.name === channel.name) return newUser.member.roles.add(role);
		if (newUserChannel.name !== channel.name) return newUser.member.roles.remove(role);
	}
});

//-----------------------UNIFIED MESSAGE EVENT-----------------------

client.on("message", async msg => {
	if (!msg.guild || msg.author.bot) return;
	client.settings.ensure(msg.guild.id, defaultSettings);
	prefix = client.settings.get(msg.guild.id, "prefix");
	//mention bot
	if (msg.mentions.has(client.user) && !msg.content.includes("@here") && !msg.content.includes("@everyone")) {
    	msg.reply('Hey! Type .help for more info! :smiley:');
		if(msg.member.hasPermission("ADMINISTRATOR")){ //if admin check for setup
			if (setupCheck(client, msg) === false) return msg.channel.send (":warning: Ops! It looks like you didn't complete the setup. Type .setup to create preset channels, roles, channel categories, etc...\nDon't worry you can later rename them.")
		}
	}
	//xp
	if (msg.guild && !msg.content.startsWith(prefix) && !talkedRecently.has(msg.author.id) && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) {
		xpAdd(client, msg, talkedRecently);
	}
	//old main
	if (!msg.content.startsWith(prefix) && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return;
  	if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
	//music-text-channel doesn't need .play command
	if (msg.channel.name === client.settings.get(msg.guild.id, "musictextchannel") && !msg.content.startsWith(prefix)) {
		var MTC_state = true;
		let cmdplay = client.commands.get("play");
		return cmdplay.run(client, msg, MTC_state);
	}
  	//commands stuff
  	const arg = msg.content.slice(prefix.length).trim().split(/ +/g);
  	const cmd = arg.shift().toLowerCase();
	//command handler
	if (cmd.length === 0) return;
  	let commandh = client.commands.get(cmd);
    if (!commandh) commandh = client.commands.get(client.aliases.get(cmd));
	if (commandh) commandh.run(client, msg, arg);
});

client.login(config.token);