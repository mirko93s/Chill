const Discord = require("discord.js");
const config = require('../../config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require ('@discordjs/voice');

module.exports = {
    name: "play",
    description: "Play a song from Youtube",
    botPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: "song",
            description: "Song/Playlist name or link from YouTube",
            type: 'STRING',
            required: true,
            focused: false,
        },
        {
            name: "skipall",
            description: "Clear the queue and play this song now",
            type: 'BOOLEAN',
            required: false,
        }
    ],
    run: async (client, interaction, MTC_state) => {
        
        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const mconlyEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(interaction.guild.id, "musictextchannel")}>`)
        const novcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription("⛔ You need to be in a voice channel to play music")
        const noresultEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ I could not obtain any search result or the link provided was invalid`)
        const queueLimit = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You can't queue more than 10 songs`)
        const playlistQueueLimit = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ Some songs in the playlist were not added due to the queue limit`)
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)

        const arg = interaction.options.getString('song');
        let searchString = arg;
        let url = arg.replace(/<(.+)>/g, '$1');

        // if (MTC_state === true) {
        //     var searchString = arg.slice(0).join(' ');
        //     var url = arg[0] ? arg[0].replace(/<(.+)>/g, '$1') : '';
        // } else {
        //     var searchString = arg.slice(1).join(' ');
        //     var url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
        // }

        await interaction.deferReply();
        if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, "djrole"))) && client.settings.get(interaction.guild.id, 'djrequired') === 'true') return interaction.followUp({ephemeral:true, embeds:[noDJroleEmbed]});
        if (client.settings.get(interaction.guild.id, "musicchannelonly") === "true" && interaction.channel.id !== client.settings.get(interaction.guild.id, "musictextchannel")) return interaction.followUp({ephemeral:true, embeds:[mconlyEmbed]});
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.followUp({ephemeral:true, embeds:[novcEmbed]});
        //queue limit
        const serverQueue = client.queue.get(interaction.guild.id);
        if (!serverQueue && interaction.options.getBoolean('skipall')) return interaction.followUp({ephemeral:true, embeds:[noplayingEmbed]});
        if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) return interaction.followUp({ephemeral:true, embeds:[queueLimit]});
        //playlist url
        if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/gi)) {
            if (ytpl.validateID(url)) {
                const playlist = await ytpl(url, {page: 1})
                const videos = playlist.items;
                if (interaction.options.getBoolean('skipall')) serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                for (const video of Object.values(videos)) {
                    const serverQueue = client.queue.get(interaction.guild.id);
                    if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) {
                        interaction.followUp({embeds:[playlistQueueLimit]});
                        break;
                    }
                    play(video, interaction, voiceChannel, true);
                }
                if (interaction.options.getBoolean('skipall')) return client.queue.get(interaction.guild.id).player.stop(); //skip to next/last song
                return;
            } else return interaction.followUp({ephemeral:true, embeds:[noresultEmbed]});
        }
        //url
        else if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                if (ytdl.validateURL(url)) {
                    await ytdl.getInfo(url).then(video => {
                        if (interaction.options.getBoolean('skipall')) {
                            serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                            play(video.videoDetails, interaction);
                            return client.queue.get(interaction.guild.id).player.stop(); //skip to next/last song
                        }
                        else return play(video.videoDetails, interaction, voiceChannel);
                    })
                }
            } catch (err) {
                console.error(err);
                return interaction.followUp({ephemeral:true, embeds:[noresultEmbed]});
            }       
        }
        //string
        else {
            try {
                const result = (await ytsr(searchString, { limit: 10 })).items.filter(a => a.type === 'video');
                if (result.length < 1) throw 'no ytsr result';
                else {
                    if (interaction.options.getBoolean('skipall')) {
                        serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                        play(result[0], interaction);
                        return client.queue.get(interaction.guild.id).player.stop(); //skip to next/last song
                    }
                    else return play(result[0], interaction, voiceChannel);
                }
            } catch (err) {
                console.error(err);
                return interaction.followUp({ephemeral:true, embeds:[noresultEmbed]});
            }
        }

        async function play(video, interaction, voiceChannel, playlist = false) {
            const serverQueue = client.queue.get(interaction.guild.id);
            const song = {
                id: video.id ? video.id : video.videoId,
                title: Discord.Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id ? video.id : video.videoId}`,
                duration: video.duration ? video.duration : new Date(video.lengthSeconds*1e3).toISOString().substr(11, 8).replace(/^[0:]+/, '')
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
                    nextResource(interaction.guild, client.queue.get(interaction.guild.id).songs[0]);
                    client.queue.get(interaction.guild.id).player.on(AudioPlayerStatus.Idle, () => {
                        if (client.queue.get(interaction.guild.id).songs.length>1) {
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
        
                    const errjoinEmbed = new Discord.MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle(":musical_note: Music")
                        .setDescription(`⛔ I couldn't join the voice channel: ${error}`)
                    return interaction.followUp({ephemeral:true, embeds:[errjoinEmbed]});
                }
            } else {
                
                const addtoqueueEmbed = new Discord.MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle(":musical_note: Music")
                    .setDescription(`✅ ${song.title} has been added to the queue`)
        
                serverQueue.songs.push(song);
                if (playlist) return undefined;
                else return interaction.followUp({embeds:[addtoqueueEmbed]});
            }
            return undefined;
        }

        function nextResource(guild, song) {
            const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32}),{inlineVolume: true});
            resource.volume.setVolume(client.queue.get(guild.id).volume / 100);

            client.queue.get(interaction.guild.id).player.play(resource);

            const playEmbed = new Discord.MessageEmbed()
                .setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
                .setColor('PURPLE')
                .setTitle(`🎵 Music`)
                .setDescription(`> ▶️ **${song.title}**`)
                .setFooter({text:`🕒 ${song.duration}`})
            interaction.followUp({embeds:[playEmbed]});
        }
    }
}