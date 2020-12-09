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
	xpcooldown: 5
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
	client.channels.cache.get(`735001555023036517`).setName(`USERS: ${users}`);
	client.channels.cache.get(`735001597926441011`).setName(`SERVERS: ${client.guilds.cache.size}`);
	//update activity and counters every 30 minutes
	setInterval(async () => { 
		let users = client.guilds.cache.reduce((a, g) => a + g.memberCount - 1, 0)
		client.channels.cache.get(`735001555023036517`).setName(`USERS: ${users}`);
		client.channels.cache.get(`735001597926441011`).setName(`SERVERS: ${client.guilds.cache.size}`);
	  	await client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	  	console.log(`Bot activity UPDATED! New user size is: ${users}. New guild size is: ${client.guilds.cache.size}`);
	}, 30*60*1000);
});
client.on('disconnect', () => console.log('Chill BOT Disconnected! Trying to reconnect...'));
client.on('reconnecting', () => console.log('Chill BOT Reconnecting!'));

client.on('guildCreate', (guild) => {
	//add guild to db and set default values
	client.settings.ensure(guild.id, defaultSettings);
	console.log(`+ Guild: ${guild.name}`);
	//msg guild owner with setup info
	const dmonweronjoinEmbed = new Discord.MessageEmbed()
		.setColor(`RANDOM`)
		.setAuthor(`Chill - Discord Bot`)
		.setURL(`https://www.mirko93s.it/`)
		.setThumbnail(client.user.avatarURL())
		.setTitle(`Thanks for inviting my bot!`)
		.setDescription(`⚠️ Follow these instructions to setup the Bot (Don't skip them!) ⚠️
		\n1️⃣ Type **.showconfig** \n> You can check the default settings in there. \n> **Then you can set them as you prefer using .setconfig.
		\n2️⃣ Type **.setup** \n> It will create required channels, roles, etc according to the config you just set.
		\n3️⃣ Set your role hierarchy\n> **Chill** (bot) role must be just below the owner/admin role.\n> **Muted** role must be above any other role that your members will get.
		\n4️⃣ Extra settings\n> Sometimes you might need to adjust channel permissions to avoid that "Muted" members can still send messages.
		\n5️⃣ Music\n> Don't forget to give **DJ** role to your members to make sure they can use Music commands.\n> If you will use "Music Only Channel" a hidden text channel will only be shown to people who are connected to the Music Vocal Channel`)
		.setFooter(`©️ 2019 by mirko93s`,`https://cdn.discordapp.com/avatars/278380909588381698/029d0578df3fa298132b3d85dd06bf3c.png?size=128`)
	guild.owner.send(dmonweronjoinEmbed);
});

client.on("guildDelete", guild => {
	console.log(`- Guild: ${guild.name}`)
	client.settings.delete(guild.id); //if a guild leaves, delete it from the db
});

client.on("guildMemberAdd", member => {

	member.roles.add(member.guild.roles.cache.find(role => role.name === client.settings.get(member.guild.id, "roleonjoin"))); //give default role to new members

	const welcomeEmbed = new Discord.MessageEmbed()
            .setColor('GREEN')
			.setTitle(`${member.user.username} joined...`)

	const welcomechannel = member.guild.channels.cache.find(welcomechannel => welcomechannel.name === (client.settings.get(member.guild.id, "welcomechannel")));
	if (!welcomechannel) return;
	else welcomechannel.send(welcomeEmbed);
});

client.on("voiceStateUpdate", (oldUser, newUser) => { //give temp role while on music voice channel
	const channel = newUser.guild.channels.cache.find(channel => channel.name === (client.settings.get(newUser.guild.id, "musicvocalchannel")));
	const role = newUser.guild.roles.cache.find(role => role.name === (client.settings.get(newUser.guild.id, "musictemprole")));
	if (channel && role) {
		let newUserChannel = newUser.channel;
		if (newUserChannel === null) return newUser.member.roles.remove(role);
		if (newUserChannel.name === channel.name) return newUser.member.roles.add(role);
		if (newUserChannel.name !== channel.name) return newUser.member.roles.remove(role);
	}
});

//BOT-MENTION
client.on('message', message=> {
	client.settings.ensure(message.guild.id, defaultSettings);
	if (message.author.bot) return;
	if (message.content.includes("@here") || message.content.includes("@everyone")) return;
  	if (message.mentions.has(client.user)) {
    	message.reply('Hey! Type .help for more info! :smiley:');
		if(message.member.hasPermission("ADMINISTRATOR")){
			let welcomechannel = message.guild.channels.cache.find(welcomechannel => welcomechannel.name === (client.settings.get(message.guild.id, "welcomechannel")));
			let bcchannel = message.guild.channels.cache.find(bcchannel => bcchannel.name === (client.settings.get(message.guild.id, "bcchannel")));
			let puchannel = message.guild.channels.cache.find(puchannel => puchannel.name === (client.settings.get(message.guild.id, "puchannel")));
			let reportchannel = message.guild.channels.cache.find(reportchannel => reportchannel.name === (client.settings.get(message.guild.id, "reportchannel")));
			let gachannel = message.guild.channels.cache.find(gachannel => gachannel.name === (client.settings.get(message.guild.id, "gachannel")));
			let pollchannel = message.guild.channels.cache.find(pollchannel => pollchannel.name === (client.settings.get(message.guild.id, "pollchannel")));
			let musicvocalchannel = message.guild.channels.cache.find(musicvocalchannel => musicvocalchannel.name === (client.settings.get(message.guild.id, "musicvocalchannel")));
			let musictextchannel = message.guild.channels.cache.find(musictextchannel => musictextchannel.name === (client.settings.get(message.guild.id, "musictextchannel")));
			let ticketcategory = message.guild.channels.cache.find(ticketcategory => ticketcategory.name === (client.settings.get(message.guild.id, "ticketcategory")));
			let musictemprole = message.guild.roles.cache.find(musictemprole => musictemprole.name === (client.settings.get(message.guild.id, "musictemprole")));
			let mutedrole = message.guild.roles.cache.find(mutedrole => mutedrole.name === (client.settings.get(message.guild.id, "mutedrole")));
			let djrole = message.guild.roles.cache.find(djrole => djrole.name === (client.settings.get(message.guild.id, "djrole")));
			let supportrole = message.guild.roles.cache.find(supportrole => supportrole.name === (client.settings.get(message.guild.id, "supportrole")));
			let roleonjoin = message.guild.roles.cache.find(roleonjoin => roleonjoin.name === (client.settings.get(message.guild.id, "roleonjoin")));	
			if(!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel|| !mutedrole || !djrole || !welcomechannel || !musicvocalchannel || !musictextchannel || !ticketcategory || !musictemprole || !supportrole || !roleonjoin)
			return message.channel.send (":warning: Ops! It looks like you didn't complete the setup. Type .setup to create preset channels, roles, channel categories, etc...\nDon't worry you can later rename them.")
		}
 	}
});

//--------------------Xp-add-----------------------
client.on(`message`, async xpmsg => {
	client.settings.ensure(xpmsg.guild.id, defaultSettings);
	PREFIX = client.settings.get(xpmsg.guild.id, "prefix");
	if (xpmsg.author.bot || xpmsg.content.startsWith(PREFIX) || talkedRecently.has(xpmsg.author.id) || xpmsg.channel.name === client.settings.get(xpmsg.guild.id, "musictextchannel")) return;
	let score;
	if (xpmsg.guild) {
		score = client.getScore.get(xpmsg.author.id, xpmsg.guild.id);
		if (!score) {
			score = { id: `${xpmsg.guild.id}-${xpmsg.author.id}`, user: xpmsg.author.id, guild: xpmsg.guild.id, points: 0, level: 0 }
		}
		score.points++;
		const curLevel = Math.floor(0.3163 * Math.sqrt(score.points));
		if(score.level < curLevel) {
			score.level = curLevel;
			const newlevelembed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setAuthor(xpmsg.author.username, xpmsg.author.avatarURL())
				.setTitle(`Congratulations!`)
				.setDescription(`You leveled up to Lvl **${curLevel}**!`)
			xpmsg.channel.send(newlevelembed);
		}
		client.setScore.run(score);

        talkedRecently.add(xpmsg.author.id);
        setTimeout(() => { //xp cooldown
          talkedRecently.delete(xpmsg.author.id);
        }, client.settings.get(xpmsg.guild.id, "xpcooldown")*1000);
    }
});

//main
client.on('message', async msg => {
	client.settings.ensure(msg.guild.id, defaultSettings);
	PREFIX = client.settings.get(msg.guild.id, "prefix");
  	if (msg.author.bot) return;
  	if (!msg.guild) return;
	if (!msg.content.startsWith(PREFIX) && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return;
  	if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
  	//music stuff
	const args = msg.content.split(' ');
	let searchString = args.slice(1).join(' ');
	let url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)
	//music-text-channel doesn't need .play command
	if (msg.channel.name === client.settings.get(msg.guild.id, "musictextchannel") && !msg.content.startsWith(PREFIX)) {
		searchString = args.slice(0).join(' ');
		url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
		command = "play";
	}
  	//commands stuff
  	const arg = msg.content.slice(PREFIX.length).trim().split(/ +/g);
  	const cmd = arg.shift().toLowerCase();
	//command handler
  	if (cmd.length === 0) return;
  	let commandh = client.commands.get(cmd);
    if (!commandh) commandh = client.commands.get(client.aliases.get(cmd));
    if (commandh) commandh.run(client, msg, arg);
}); //end of main

client.login(config.token);