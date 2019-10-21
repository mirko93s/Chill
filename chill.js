const { Client, Util, Collection } = require('discord.js');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const Discord = require("discord.js");
const fs = require("fs");
const config = require('./config.json');
const PREFIX = config.prefix;
const GOOGLE_API_KEY = config.google_api_key
const client = new Client({ disableEveryone: false });
const youtube = new YouTube(GOOGLE_API_KEY);
const queue = new Map();

client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

client.on('warn', console.warn);
client.on('error', console.error);
//client.on('ready', () => {console.log("Chill BOT Ready!"); client.user.setActivity(`${client.users.size} users`, {type: `WATCHING`});});
client.on('ready', () => {
	setInterval(async () => {
	  	let users = 0;
	  	for (let g of client.guilds.array()) users += (g.members.size - 1);
	  	await client.user.setActivity(`${users} user${users !== 1 ? 's' : ''}`, {type: 'WATCHING'});
	  	console.log(`Bot activity UPDATED! New user size is: ${users}`);
	}, 30*60*1000);
});
client.on('disconnect', () => console.log('Chill BOT Disconnected! Trying to reconnect...'));
client.on('reconnecting', () => console.log('Chill BOT Reconnecting!'));

//BOT-MENTION
client.on('message', message=> {
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

//main
client.on('message', async msg => {
  	if (msg.author.bot) return;
  	if (!msg.guild) return;
  	if (!msg.content.startsWith(PREFIX)) return;
  	if (!msg.member) msg.member = await msg.guild.fetchMember(msg);
  	//music stuff
	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
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

  //PLAY
	if (command === 'play' || command === 'p') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {

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
			return handleVideo(video, msg, voiceChannel);
		}
  } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //SKIP
  if (command === 'skip') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
		serverQueue.connection.dispatcher.end('Skip command has been used!');

		const skipEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:track_next: Skipped`)

    	return msg.channel.send (skipEmbed);
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }

  //STOP
  if (command === 'stop') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');

		const stopEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:stop_button: Stopped`)

    	return msg.channel.send(stopEmbed);
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

		if (!args[1]) return msg.channel.send(currentvolumeEmbed);
		serverQueue.volume = args[1];

		const newvolumeEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:speaker: New volume: **${args[1]}**`)

		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    	return msg.channel.send(newvolumeEmbed);
    } else return msg.channel.send(nopermvolumeEmbed).then(msg => msg.delete(5000));
  }
  
  //NOW-PLAYING
  if (command === 'nowplaying' || command === 'np') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));

		const nowplayingEmbed = new Discord.RichEmbed()
		.setColor('PURPLE')
		.setTitle(":musical_note: Music")
		.setDescription(`🎶 **${serverQueue.songs[0].title}**`)

    	return msg.channel.send(nowplayingEmbed);
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //QUEUE
  if (command === 'queue') {
	msg.delete();
	if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));

		const queueEmbed = new Discord.RichEmbed()
		.setColor('PURPLE')
		.setTitle(":musical_note: Music")
		.setDescription(`:twisted_rightwards_arrows: Queue:\n\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n\n🎶 **${serverQueue.songs[0].title}**`)

		return msg.channel.send(queueEmbed);
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //PAUSE
  if (command === 'pause') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();

			const pauseEmbed = new Discord.RichEmbed()
			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`⏸ Paused`)

			return msg.channel.send(pauseEmbed);
		}
    	return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
  }
  
  //RESUME
  if (command === 'resume') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete(5000));
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			const resumeEmbed = new Discord.RichEmbed()

			.setColor('PURPLE')
			.setTitle(":musical_note: Music")
			.setDescription(`:play_pause: Resumed`)

			return msg.channel.send(resumeEmbed);
		}
    	return msg.channel.send(noplayingEmbed).then(msg => msg.delete(5000));
    } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete(5000));
	} 

}); //end of main

//--------------------Music: functions--------------------
async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
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
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(addtoqueueEmbed);
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
	console.log(serverQueue.songs);

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
		.setColor('PURPLE')
		.setTitle(":musical_note: Music")
		.setDescription(`:arrow_forward: **${song.title}**`)

	serverQueue.textChannel.send(playEmbed);

}

client.login(config.token);