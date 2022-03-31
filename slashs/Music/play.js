const Discord = require(`discord.js`);
const config = require(`../../config.json`);
const ytdl = require(`ytdl-core`);
const ytsr = require(`ytsr`);
const ytpl = require(`ytpl`);
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require (`@discordjs/voice`);

module.exports = {
	name: `play`,
	description: `Play a song from Youtube`,
	botPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `song`,
			description: `Song/Playlist name or link from YouTube`,
			type: `STRING`,
			required: true,
			focused: false,
		},
		{
			name: `skipall`,
			description: `Clear the queue and play this song now`,
			type: `BOOLEAN`,
			required: false,
		},
	],
	run: async (client, interaction, LANG) => {

		const arg = interaction.options.getString(`song`);
		const searchString = arg;
		const url = arg.replace(/<(.+)>/g, `$1`);

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		// queue limit
		const serverQueue = client.queue.get(interaction.guild.id);
		if (!serverQueue && interaction.options.getBoolean(`skipall`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });
		if (serverQueue && serverQueue.songs.length > config.music_queue_limit - 1) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.queue_limit)] });

		if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/gi)) { // playlist
			let pladded = 0;
			let plq = false;
			if (ytpl.validateID(url)) {
				const playlist = await ytpl(url, { page: 1 });
				const videos = playlist.items;
				if (interaction.options.getBoolean(`skipall`)) serverQueue.songs = serverQueue.songs.slice(-1);
				for (const video of Object.values(videos)) {
					pladded++;
					if (serverQueue && serverQueue.songs.length > config.music_queue_limit - 1) {
						plq = true;
						break;
					}
					play(video, interaction, voiceChannel, true);
				}
				const addPltoqueueEmbed = new Discord.MessageEmbed()
					.setColor(`PURPLE`)
					.setTitle(LANG.title)
					.setDescription(LANG.playlist_queued(pladded, plq));
				interaction.reply({ embeds: [addPltoqueueEmbed] });
				if (interaction.options.getBoolean(`skipall`)) return client.queue.get(interaction.guild.id).player.stop();
				return;
			} else {
				return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result)] });
			}
		} else if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) { // url
			try {
				if (ytdl.validateURL(url)) {
					await ytdl.getInfo(url).then(video => {
						if (interaction.options.getBoolean(`skipall`)) {
							serverQueue.songs = serverQueue.songs.slice(-1);
							play(video.videoDetails, interaction);
							return client.queue.get(interaction.guild.id).player.stop();
						} else {
							return play(video.videoDetails, interaction, voiceChannel);
						}
					});
				}
			} catch (err) {
				// console.error(err);
				return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result)] });
			}
		} else { // string search
			try {
				const result = (await ytsr(searchString, { limit: 10 })).items.filter(a => a.type === `video`);
				if (result.length < 1) {
					throw `no ytsr result`;
				} else if (interaction.options.getBoolean(`skipall`)) {
					serverQueue.songs = serverQueue.songs.slice(-1);
					play(result[0], interaction);
					return client.queue.get(interaction.guild.id).player.stop();
				} else {
					return play(result[0], interaction, voiceChannel);
				}
			} catch (err) {
				// console.error(err);
				return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result)] });
			}
		}

		// eslint-disable-next-line no-shadow
		async function play(video, interaction, voiceChannel, playlist = false) {
			// eslint-disable-next-line no-shadow
			const serverQueue = client.queue.get(interaction.guild.id);
			const song = {
				id: video.id ? video.id : video.videoId,
				title: Discord.Util.escapeMarkdown(video.title),
				url: `https://www.youtube.com/watch?v=${video.id ? video.id : video.videoId}`,
				duration: video.isLive ? LANG.live : video.duration ? video.duration : new Date(video.lengthSeconds * 1e3).toISOString().substring(11, 19).replace(/^[0:]+/, ``),
				requester: interaction.user,
			};

			if (!serverQueue) {
				const queueConstruct = {
					textChannel: interaction.channel,
					songs: [],
					volume: 100,
					playing: true,
					player: createAudioPlayer(),
				};
				client.queue.set(interaction.guild.id, queueConstruct);

				queueConstruct.songs.push(song);

				try {
					await joinVoiceChannel({
						channelId: voiceChannel.id,
						guildId: voiceChannel.guild.id,
						adapterCreator: voiceChannel.guild.voiceAdapterCreator,
					});
					nextResource(interaction.guild, client.queue.get(interaction.guild.id).songs[0], true, playlist);
					client.queue.get(interaction.guild.id).player.on(AudioPlayerStatus.Idle, () => {
						if (client.queue.get(interaction.guild.id).songs.length > 1) {
							client.queue.get(interaction.guild.id).songs.shift();
							return nextResource(interaction.guild, client.queue.get(interaction.guild.id).songs[0]);
						} else {
							return getVoiceConnection(interaction.guild.id).destroy();
						}
					});
					getVoiceConnection(voiceChannel.guild.id).subscribe(client.queue.get(interaction.guild.id).player);
				} catch (error) {
					console.error(`I could not join the voice channel: ${error}`);
					client.queue.delete(interaction.guild.id);
					getVoiceConnection(voiceChannel.guild.id).destroy();
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.couldnt_join(error))] });
				}
			} else {
				const addtoqueueEmbed = new Discord.MessageEmbed()
					.setColor(`PURPLE`)
					.setTitle(LANG.title)
					.setDescription(LANG.queued(song.title));

				serverQueue.songs.push(song);
				if (!playlist) return interaction.reply({ embeds: [addtoqueueEmbed] });
			}
			return;
		}

		function nextResource(guild, song, first = false, playlist = false) {
			const resource = createAudioResource(ytdl(song.url, {
				quality: [250, 140, 251, 249, 91, 93, 95],
				/**
				 * 				AUDIO FORMATS (explained)
				 * 		itag	codec	bitrate	test-size MB
				 * 		140		aac		128		2,509
				 * 		249		opus	48		1,202
				 * 		250		opus	64		1,569
				 * 		251		opus	160		3,012
				 * 				LIVE STREAMS
				 * 		91		aac		48		n/a
				 * 		93		aac		128		n/a
				 * 		95		aac		256		n/a
				 *
				 * 92-94-96 have same audio quality as their previous one but with better video quality (unnecessary on bot)
				 *
				 * [250,140,251,249]
				 *
				 * itag 140 appears to be used for both normal and live videos, 128kbps quality and an audio spectrum very similar to 720p videos
				 * 140 is not working with lives tho, not implemented in ytdl??????
				 */
				highWaterMark: 1 << 22 }),
			/**
				 * 9 default 512k
				 * 22 4mb
				 * 25 32mb
				 */
			{ inlineVolume: true });
			resource.volume.setVolume(client.queue.get(guild.id).volume / 100);

			client.queue.get(interaction.guild.id).player.play(resource);

			const playEmbed = new Discord.MessageEmbed()
				.setColor(`PURPLE`)
				.setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
				.setAuthor({ name: LANG.title })
				.setDescription(`**[${song.title}](${song.url})**\n\`🕒${song.duration}\``)
				.setURL(song.url)
				.setFooter({ text: LANG.by(song.requester.username), iconURL: song.requester.displayAvatarURL() });

			if (first && !playlist) interaction.reply({ embeds: [playEmbed] });
			else client.queue.get(interaction.guild.id).textChannel.send({ embeds: [playEmbed] });
		}
	},
};