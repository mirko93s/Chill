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
client.on('ready', () => {console.log("Chill BOT Ready!"); client.user.setActivity(`coding w/ mirko93s`);});
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
      let gachannel = message.guild.channels.find(gachannel => gachannel.name === '🎉giveaway')
      let mutedrole = message.guild.roles.find(mutedrole => mutedrole.name === "Muted");
      let djrole = message.guild.roles.find(djrole => djrole.name === "DJ");
      if(!bcchannel || !puchannel || !reportchannel || !gachannel || !mutedrole || !djrole)
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
  
  	if (cmd.length === 0) return;
  
  	let commandh = client.commands.get(cmd);
    	if (!commandh) commandh = client.commands.get(client.aliases.get(cmd));

    	if (commandh) 
			commandh.run(client, msg, arg);

//--------------------Music--------------------

  //PLAY
	if (command === 'play' || command === 'p') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
    }
    
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
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
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
  } else return msg.reply("Sorry you don't have DJ role.");
  }

  //SKIP
  if (command === 'skip') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
    return msg.channel.send (":track_next: Song skipped.");
    } else return msg.reply("Sorry you don't have DJ role.");
  }

  //STOP
  if (command === 'stop') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
    return msg.channel.send(":stop_button: Music stopped.");
    } else return msg.reply("Sorry you don't have DJ role.");
  }

  //VOLUME
  if (command === 'volume') {
    msg.delete();
    if (msg.member.hasPermission("ADMINISTRATOR")) {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    return msg.channel.send(`I set the volume to: **${args[1]}**`);
    } else return msg.reply("Sorry, you don't have permission to use this!");
  }
  
  //NOW-PLAYING
  if (command === 'nowplaying' || command === 'np') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
    return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
    } else return msg.reply("Sorry you don't have DJ role.");
  }
  
  //QUEUE
  if (command === 'queue') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
    return msg.channel.send(`
__**Song queue:**__

${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now playing:** ${serverQueue.songs[0].title}
    `);
    } else return msg.reply("Sorry you don't have DJ role.");
  }
  
  //PAUSE
  if (command === 'pause') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Paused the music for you!');
		}
    return msg.channel.send('There is nothing playing.');
    }
  }
  
  //RESUME
  if (command === 'resume') {
    msg.delete();
    if (msg.member.roles.some(role => role.name === 'DJ')) {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ Resumed the music for you!');
		}
    return msg.channel.send('There is nothing playing.');
    }
	} 

}); //end of main

//--------------------Music: other--------------------
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
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
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

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

client.login(config.token);