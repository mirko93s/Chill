const { Client, Util, Collection } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const fs = require("fs");
const config = require('./config.json');
// const PREFIX = config.prefix;
const GOOGLE_API_KEY = config.google_api_key
const client = new Client({ disableEveryone: false });
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();
const SQLite = require("better-sqlite3");
const sql = new SQLite('./scores.sqlite');
const Enmap = require('enmap');
var videoid;
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
	prefix: "-",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	musicvolume: "5", //check default value, it is logarithmic
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false"
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
	let users = 0;
	for (let g of client.guilds.array()) users += (g.members.size - 1);
	client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	//set channel counters in my server
	client.channels.get(`735001555023036517`).setName(`USERS: ${client.users.size}`);
	client.channels.get(`735001597926441011`).setName(`SERVERS: ${client.guilds.size}`);
	//update activity and counters every 30 minutes
	setInterval(async () => { 
		client.channels.get(`735001555023036517`).setName(`USERS: ${client.users.size}`);
		client.channels.get(`735001597926441011`).setName(`SERVERS: ${client.guilds.size}`);
	  	let users = 0;
	  	for (let g of client.guilds.array()) users += (g.members.size - 1);
	  	await client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	  	console.log(`Bot activity UPDATED! New user size is: ${users}\nCounter channels updated!`);
	}, 30*60*1000);
});
client.on('disconnect', () => console.log('Chill BOT Disconnected! Trying to reconnect...'));
client.on('reconnecting', () => console.log('Chill BOT Reconnecting!'));

client.on('guildCreate', (guild) => {
	//add guild to db and set default values
	client.settings.ensure(guild.id, defaultSettings);
	console.log(`+ Guild: ${guild.name}`);
	//msg guild owner with setup info
	const dmonweronjoinEmbed = new Discord.RichEmbed()
		.setColor(`RANDOM`)
		.setAuthor(`Chill - Discord Bot`)
		.setURL(`https://www.mirko93s.it/`)
		.setThumbnail(client.user.avatarURL)
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
//if a guild leave delete it from the db
client.on("guildDelete", guild => {
	console.log(`- Guild: ${guild.name}`)
	client.settings.delete(guild.id);
});
//welcome message new members
client.on("guildMemberAdd", member => {

	member.addRole(member.guild.roles.find(role => role.name === client.settings.get(member.guild.id, "roleonjoin")));

	const welcomeEmbed = new Discord.RichEmbed()
            .setColor('GREEN')
			.setTitle(`${member.user.username} joined...`)

	const welcomechannel = member.guild.channels.find(welcomechannel => welcomechannel.name === (client.settings.get(member.guild.id, "welcomechannel")));
	if (!welcomechannel) return;
	else welcomechannel.send(welcomeEmbed);
});

client.on("voiceStateUpdate", (oldMember, newMember) => {
	const channel = newMember.guild.channels.find(channel => channel.name === (client.settings.get(newMember.guild.id, "musicvocalchannel")));
	const role = newMember.guild.roles.find(role => role.name === (client.settings.get(newMember.guild.id, "musictemprole")));
	let newUserChannel = newMember.voiceChannel;	
	if (newUserChannel === undefined) return newMember.removeRole(role);
	if (newUserChannel.name === channel.name) return newMember.addRole(role);
	if (newUserChannel.name !== channel.name) return newMember.removeRole(role);
});

//BOT-MENTION
client.on('message', message=> {
	client.settings.ensure(message.guild.id, defaultSettings);
  	if (message.author.bot) return;
  	if (message.isMentioned(client.user)) {
    message.reply('Hey! Type .help for more info! :smiley:');
    if(message.member.hasPermission("ADMINISTRATOR")){
      let bcchannel = message.guild.channels.find(bcchannel => bcchannel.name === '🔴broadcast');
      let puchannel = message.guild.channels.find(puchannel => puchannel.name === '🔨punishments');
      let reportchannel = message.guild.channels.find(reportchannel => reportchannel.name === '🚨reports');
	  let gachannel = message.guild.channels.find(gachannel => gachannel.name === '🎉giveaway');
	  let pollchannel = message.guild.channels.find(pollchannel => pollchannel.name === `💡poll`);
      let mutedrole = message.guild.roles.find(mutedrole => mutedrole.name === "Muted");
      let djrole = message.guild.roles.find(djrole => djrole.name === "DJ");
      if(!bcchannel || !puchannel || !reportchannel || !gachannel || !pollchannel|| !mutedrole || !djrole)
      return message.channel.send (":warning: Ops! It looks like you didn't complete the setup. Type .setup to configure needed roles and channels to let me do my job!")
    }
  }
});

//--------------------Xp-add-----------------------
client.on(`message`, async xpmsg => {
	client.settings.ensure(xpmsg.guild.id, defaultSettings);
	PREFIX = client.settings.get(xpmsg.guild.id, "prefix");
	if (xpmsg.author.bot) return;
	if (xpmsg.content.startsWith(PREFIX)) return;
	if (talkedRecently.has(xpmsg.author.id)) return;
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
			const newlevelembed = new Discord.RichEmbed()
				.setColor(`RANDOM`)
				.setAuthor(xpmsg.author.username, xpmsg.author.avatarURL)
				.setTitle(`Congratulations!`)
				.setDescription(`You leveled up to Lvl **${curLevel}**!`)
			xpmsg.channel.send(newlevelembed);
		}
		client.setScore.run(score);

        talkedRecently.add(xpmsg.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(xpmsg.author.id);
        }, 5000);
    }
});

//main
client.on('message', async msg => {
	client.settings.ensure(msg.guild.id, defaultSettings);
	PREFIX = client.settings.get(msg.guild.id, "prefix");
  	if (msg.author.bot) return;
  	if (!msg.guild) return;
	if (!msg.content.startsWith(PREFIX)) return;
  	if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
  	//music stuff
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	let url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  	const serverQueue = queue.get(msg.guild.id);
  	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)
  	//commands stuff
  	const arg = msg.content.slice(PREFIX.length).trim().split(/ +/g);
  	const cmd = arg.shift().toLowerCase();
	//command handler
  	if (cmd.length === 0) return;
  	let commandh = client.commands.get(cmd);
    if (!commandh) commandh = client.commands.get(client.aliases.get(cmd));
    if (commandh) commandh.run(client, msg, arg);



//--------------------Xp-cmds---------------
	let score;
	score = client.getScore.get(msg.author.id, msg.guild.id);
		if (!score) {
			score = { id: `${msg.guild.id}-${msg.author.id}`, user: msg.author.id, guild: msg.guild.id, points: 0, level: 0 }
		}
  	if(command === "level") {
		msg.delete();
		let fixedpoints = score.points;
		if(fixedpoints >= 1000 && fixedpoints <10000) fixedpoints = `${parseFloat(fixedpoints/1000).toFixed(1)} K`
			else if(fixedpoints >= 10000 && fixedpoints < 1000000) fixedpoints = `${Math.floor(fixedpoints/1000)} K`
				else if(fixedpoints >= 1000000 && fixedpoints < 10000000) fixedpoints = `${parseFloat(fixedpoints/1000000).toFixed(1)} M`
					else if(fixedpoints >= 10000000) fixedpoints = `${Math.floor(fixedpoints/1000000)} M`
		const levelembed = new Discord.RichEmbed()
			.setColor(`RANDOM`)
			.setAuthor(msg.author.username, msg.author.avatarURL)
			.setTitle(`Lvl ${score.level}`)
			.setDescription(`${fixedpoints} points`)
		return msg.channel.send(levelembed);
	}

  	if(command === "xp") {
		msg.delete();
		const nopermEmbed = new Discord.RichEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You don't have permission to use this!`)
		const noargsEmbed = new Discord.RichEmbed()
            .setColor(`RED`)
			.setTitle(`⛔ Please mention a valid user of this server and provide mode and amount.`)
		const nonegativeEmbed = new Discord.RichEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ Points can't be negative!`)
		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.channel.send(nopermEmbed).then(m => m.delete(5000));
		let user = msg.mentions.users.first() || client.users.get(arg[0]);
		if(!user) return msg.channel.send(noargsEmbed).then(m => m.delete(5000));
		let mode = arg[1];
		if(!mode) return msg.channel.send(noargsEmbed).then(m => m.delete(5000));
			else if(mode !== "take" && mode !== "give" && mode !== "set") return msg.channel.send(noargsEmbed).then(m => m.delete(5000));
		let pointsToAdd = parseInt(arg[2], 10);
		if(arg[2] == 0) pointsToAdd = 0;
			else if (!pointsToAdd) return msg.channel.send(noargsEmbed).then(m => m.delete(5000));
		let userscore = client.getScore.get(user.id, msg.guild.id);
		if (!userscore) {
			userscore = { id: `${msg.guild.id}-${user.id}`, user: user.id, guild: msg.guild.id, points: 0, level: 0 }
		}
		let xpmsg;
		if(mode == "give") {
			userscore.points += pointsToAdd;
			xpmsg = "+";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}		
		if(mode == "take") {
			if(userscore.points-pointsToAdd < 0) return msg.channel.send(nonegativeEmbed).then(m => m.delete(5000));
			userscore.points -= pointsToAdd;
			xpmsg = "-";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}
		if(mode == "set") {
			userscore.points = pointsToAdd;
			xpmsg = "Set to";
			let userLevel = Math.floor(0.2 * Math.sqrt(userscore.points));
			userscore.level = userLevel;
			client.setScore.run(userscore);
		}
		const xpcmdembed = new Discord.RichEmbed()
			.setColor(`RANDOM`)
			.setAuthor(user.username, user.avatarURL)
			.setTitle(`${xpmsg} ${pointsToAdd} points`)
			.setDescription(`by ${msg.author.username}`)
		return msg.channel.send(xpcmdembed);
	}

  	if(command === "leaderboard" || command === "lb") {
		msg.delete();
		const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(msg.guild.id);
		let emojiposition = 0;
		const embed = new Discord.RichEmbed()
			.setTitle("🏆 Leaderboard 🏆")
			.setAuthor(msg.guild.name, msg.guild.iconURL)
			.setDescription("Top 10")
			.setColor(0x00AE86);
		var emoji = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
		for(const data of top10) {
			if(data.points >= 1000 && data.points <10000) data.points = `${parseFloat(data.points/1000).toFixed(1)} K`
				else if(data.points >= 10000 && data.points < 1000000) data.points = `${Math.floor(data.points/1000)} K`
					else if(data.points >= 1000000 && data.points < 10000000) data.points = `${parseFloat(data.points/1000000).toFixed(1)} M`
						else if(data.points >= 10000000) data.points = `${Math.floor(data.points/1000000)} M`
			embed.addField(`${emoji[emojiposition]}**${client.users.get(data.user).username}**`, `> ${data.points} | Lvl ${data.level}`, true);
			emojiposition++;
		}
		return msg.channel.send(embed);
  	}

//--------------------Music--------------------

const noDJroleEmbed = new Discord.RichEmbed()
	.setColor('PURPLE')
	.setTitle(":musical_note: Music")
	.setDescription(`⛔ You don't have DJ role`)
const noplayingEmbed = new Discord.RichEmbed()
	.setColor('PURPLE')
	.setTitle(":musical_note: Music")
	.setDescription(`⛔ There is nothing playing`)
const notinvcEmbed = new Discord.RichEmbed()
	.setColor('PURPLE')
	.setTitle(":musical_note: Music")
	.setDescription(`⛔ You are not in a voice channel`)
const mconlyEmbed = new Discord.RichEmbed()
	.setColor(`RANDOM`)
	.setTitle(":musical_note: Music")
	.setDescription(`Music Channel Only is active!`)
	.setFooter(`You can only use the music module in: ${client.settings.get(msg.guild.id, "musicvocalchannel")}`)
const nosummonEmbed = new Discord.RichEmbed()
	.setColor(`RANDOM`)
	.setTitle(":musical_note: Music")
	.setDescription(`Music Channel Only is active! \`summon\` command is disabled`)
	.setFooter(`You can only use the music module in: ${client.settings.get(msg.guild.id, "musicvocalchannel")}`)
	
  //PLAY
	if (command === 'play' || command === 'p') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));

		const nourlEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ No song or link provided")
		const novcEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ You need to be in a voice channel to play music")
		const noconnectpermEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ I can't connect to your voice channel, make sure I have the proper permission")
		const nospeakpermEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ I can't speak in this voice channel, make sure i Have the proper permission")
		const noresultEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`⛔ I could not obtain any search results.`)

		if (!url) return msg.channel.send(nourlEmbed).then(msg => msg.delete(5000));
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(novcEmbed).then(msg => msg.delete(5000));
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) return msg.channel.send(noconnectpermEmbed).then(msg => msg.delete(5000));
		if (!permissions.has('SPEAK')) return msg.channel.send(nospeakpermEmbed).then(msg => msg.delete(5000));
    	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
				
				const addtoqueueEmbed = new Discord.RichEmbed()
					.setColor('PURPLE')
					.setTitle(":musical_note: Music")
					.setDescription(`✅ **${playlist.title}** has been added to the queue`)

			}return msg.channel.send(addtoqueueEmbed).then(msg => msg.delete(5000));
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					// eslint-disable-next-line max-depth
					const videoIndex = 1;
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(noresultEmbed).then(msg => msg.delete(5000));
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
  } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //SKIP
  if (command === 'skip') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
		serverQueue.connection.dispatcher.end();

		const skipEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:track_next: Skipped`)

    	return msg.channel.send (skipEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //PLAYSKIP
  if (command === 'playskip' || command === 'ps') {
	msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
		
		const nourlEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ No song or link provided")
		const novcEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ You need to be in a voice channel to play music")
		const noconnectpermEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ I can't connect to your voice channel, make sure I have the proper permission")
		const nospeakpermEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription("⛔ I can't speak in this voice channel, make sure i Have the proper permission")
		const noresultEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`⛔ I could not obtain any search results.`)

		if (!url) return msg.channel.send(nourlEmbed).then(msg => msg.delete(5000));
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send(novcEmbed).then(msg => msg.delete(5000));
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) return msg.channel.send(noconnectpermEmbed).then(msg => msg.delete(5000));
		if (!permissions.has('SPEAK')) return msg.channel.send(nospeakpermEmbed).then(msg => msg.delete(5000));

    	if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
				
				const addtoqueueEmbed = new Discord.RichEmbed()
					.setColor('PURPLE')
					.setTitle(":musical_note: Music")
					.setDescription(`✅ **${playlist.title}** has been added to the queue`)

			}return msg.channel.send(addtoqueueEmbed);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					// eslint-disable-next-line max-depth
					const videoIndex = 1;
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send(noresultEmbed).then(msg => msg.delete(5000));
				}
			}
			handleVideo(video, msg, voiceChannel);
			serverQueue.songs = serverQueue.songs.slice(-2); //clear queue except last 2 songs
			serverQueue.connection.dispatcher.end(); //skip to next-last song
		}
		
  	} else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //STOP
  if (command === 'stop') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end();

		const stopEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:stop_button: Stopped`)

    	return msg.channel.send(stopEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //VOLUME
  if (command === 'volume') {
	msg.delete();

	const nopermvolumeEmbed = new Discord.RichEmbed()
	.setColor('PURPLE')
	.setTitle(":musical_note: Music")
	.setDescription(`⛔ You don't have permission to use this!`)

    if (msg.member.hasPermission("ADMINISTRATOR")) {
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));

		const currentvolumeEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:speaker: Current volume: **${serverQueue.volume}**`)

		if (!args[1]) return msg.channel.send(currentvolumeEmbed).then(msg => msg.delete(5000));
		serverQueue.volume = args[1];

		const newvolumeEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:speaker: New volume: **${args[1]}**`)

		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    	return msg.channel.send(newvolumeEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(nopermvolumeEmbed).then(msg => msg.delete(5000));
  }
  
  //NOW-PLAYING
  if (command === 'nowplaying' || command === 'np') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));

		const nowplayingEmbed = new Discord.RichEmbed()
		.setColor('PURPLE')
		.setTitle(":musical_note: Music")
		.setDescription(`🎶 **${serverQueue.songs[0].title}**`)

    	return msg.channel.send(nowplayingEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //QUEUE
  if (command === 'queue') {
	msg.delete();
	if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));

		const queueEmbed = new Discord.RichEmbed()
		.setColor('PURPLE')
		.setTitle(":musical_note: Music")
		.setDescription(`:twisted_rightwards_arrows: Queue:\n\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n\n🎶 **${serverQueue.songs[0].title}**`)

		return msg.channel.send(queueEmbed).then(msg => msg.delete(15000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //PAUSE
  if (command === 'pause') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();

			const pauseEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`⏸ Paused`)

			return msg.channel.send(pauseEmbed).then(msg => msg.delete(5000));
		}
    	return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //RESUME
  if (command === 'resume') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			const resumeEmbed = new Discord.RichEmbed()

			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:play_pause: Resumed`)

			return msg.channel.send(resumeEmbed).then(msg => msg.delete(5000));
		}
    	return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
	} 

  //SUMMON
  if (command === 'summon') {
	msg.delete();
	if (msg.member.roles.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
		if (client.settings.get(msg.guild.id, "musicchannelonly") === "true") return msg.channel.send(nosummonEmbed).then(msg => msg.delete(5000));
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		let memberVoiceChannel = msg.member.voiceChannel;
		memberVoiceChannel.join();
	} else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

}); //end of main

//--------------------Music: functions--------------------
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	// console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	videoid = song.id;

	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);

			const errjoinEmbed = new Discord.RichEmbed()
				.setColor('PURPLE')
				.setTitle(":musical_note: Music")
				.setDescription(`⛔ I couldn't join the voice channel: ${error}`)

			return msg.channel.send(errjoinEmbed).then(msg => msg.delete(5000));
		}
	} else {
		
		const addtoqueueEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`✅ ${song.title} has been added to the queue`)

		serverQueue.songs.push(song);
		// console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(addtoqueueEmbed).then(msg => msg.delete(5000));
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	// console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
	
	const playEmbed = new Discord.RichEmbed()
		.setImage(`https://i.ytimg.com/vi/${videoid}/maxresdefault.jpg`)
		.setColor('PURPLE')
		.setTitle(`:musical_note: Music`)
		.setDescription(`:arrow_forward: **${song.title}**`)

	serverQueue.textChannel.send(playEmbed);

}

client.login(config.token);