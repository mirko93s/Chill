const Discord = require("discord.js");
const config = require('../../config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require ('@discordjs/voice');

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "Music",
    description: "Play a song from Youtube",
    usage: "play <song name | playlist name | yt link | yt playlist>\n**e.g.**\n\`play best song ever\`\n> will search and play \"best song ever\" from Youtube\n> The result can either be a video or a playlist\n> Playlist will be played till the end of itself\n> You can also provide a direct link to the Youtube video/playlist",
    run: async (client, msg, MTC_state) => {
        
        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const mconlyEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(msg.guild.id, "musictextchannel")}>`)
        const nourlEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription("⛔ No song or link provided")
        const novcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription("⛔ You need to be in a voice channel to play music")
        const noconnectpermEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription("⛔ I can't connect to your voice channel, make sure I have the proper permission")
        const nospeakpermEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription("⛔ I can't speak in this voice channel, make sure i Have the proper permission")
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

        const arg = msg.content.split(' ');
       
        if (MTC_state === true) {
            var searchString = arg.slice(0).join(' ');
            var url = arg[0] ? arg[0].replace(/<(.+)>/g, '$1') : '';
        } else {
            var searchString = arg.slice(1).join(' ');
            var url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
        }

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole"))) && client.settings.get(msg.guild.id, 'djrequired') === 'true') return msg.channel.send({embeds:[noDJroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send({embeds:[mconlyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10e3));
        if (!url) return msg.channel.send({embeds:[nourlEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel) return msg.channel.send({embeds:[novcEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) return msg.channel.send({embeds:[noconnectpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        if (!permissions.has('SPEAK')) return msg.channel.send({embeds:[nospeakpermEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        //queue limit
        const serverQueue = client.queue.get(msg.guild.id);
        if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) return msg.channel.send({embeds:[queueLimit]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        //playlist url
        if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/gi)) {
            if (ytpl.validateID(url)) {
                const playlist = await ytpl(url, {page: 1})
                const videos = playlist.items;
                for (const video of Object.values(videos)) {
                    const serverQueue = client.queue.get(msg.guild.id);
                    if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) {
                        msg.channel.send({embeds:[playlistQueueLimit]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                        break;
                    }
                    play(video, msg, voiceChannel, true);
                }
                return;
            } else return msg.channel.send({embeds:[noresultEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        }
        //url
        else if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
            try {
                if (ytdl.validateURL(url)) {
                    await ytdl.getInfo(url).then(video => {
                        return play(video.videoDetails, msg, voiceChannel);
                    })
                }
            } catch (err) {
                console.error(err);
                return msg.channel.send({embeds:[noresultEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
            }       
        }
        //string
        else {
            try {
                const result = (await ytsr(searchString, { limit: 10 })).items.filter(a => a.type === 'video');
                return play(result[0], msg, voiceChannel);
            } catch (err) {
                console.error(err);
                return msg.channel.send({embeds:[noresultEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
            }
        }

        async function play(video, msg, voiceChannel, playlist = false) {
            const serverQueue = client.queue.get(msg.guild.id);
            const song = {
                id: video.id ? video.id : video.videoId,
                title: Discord.Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id ? video.id : video.videoId}`,
                duration: video.duration ? video.duration : new Date(video.lengthSeconds*1e3).toISOString().substr(11, 8).replace(/^[0:]+/, '')
            };
        
            if (!serverQueue) {
                const queueConstruct = {
                    textChannel: msg.channel,
                    songs: [],
                    volume: 100,
                    playing: true,
                    player: createAudioPlayer(),
                };
                client.queue.set(msg.guild.id, queueConstruct);
        
                queueConstruct.songs.push(song);
        
                try {
                    await joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: voiceChannel.guild.id,
                        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                    });
                    nextResource(msg.guild, client.queue.get(msg.guild.id).songs[0]);
                    client.queue.get(msg.guild.id).player.on(AudioPlayerStatus.Idle, () => {
                        if (client.queue.get(msg.guild.id).songs.length>1) {
                            client.queue.get(msg.guild.id).songs.shift();
                            return nextResource(msg.guild, client.queue.get(msg.guild.id).songs[0]);
                        } else {
                            return getVoiceConnection(msg.guild.id).destroy();
                        }
                    });
                    getVoiceConnection(voiceChannel.guild.id).subscribe(client.queue.get(msg.guild.id).player);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    client.queue.delete(msg.guild.id);
                    getVoiceConnection(voiceChannel.guild.id).destroy();
        
                    const errjoinEmbed = new Discord.MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle(":musical_note: Music")
                        .setDescription(`⛔ I couldn't join the voice channel: ${error}`)
        
                    return msg.channel.send({embeds:[errjoinEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
                }
            } else {
                
                const addtoqueueEmbed = new Discord.MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle(":musical_note: Music")
                    .setDescription(`✅ ${song.title} has been added to the queue`)
        
                serverQueue.songs.push(song);
                if (playlist) return undefined;
                else return msg.channel.send({embeds:[addtoqueueEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
            }
            return undefined;
        }

        function nextResource (guild, song) {
            const resource = createAudioResource(ytdl(song.url, { filter: 'audioonly', highWaterMark: 1048576 * 32}),{inlineVolume: true});
            resource.volume.setVolume(client.queue.get(guild.id).volume / 100);

            client.queue.get(msg.guild.id).player.play(resource);

            const playEmbed = new Discord.MessageEmbed()
                .setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
                .setColor('PURPLE')
                .setTitle(`🎵 Music`)
                .setDescription(`> ▶️ **${song.title}**`)
                .setFooter(`⏲️ ${song.duration}`)
            
            client.queue.get(guild.id).textChannel.send({embeds:[playEmbed]});      
        }
    }
}