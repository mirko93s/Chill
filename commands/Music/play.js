const Discord = require("discord.js");
const {Util} = require("discord.js");
const config = require('../../config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');

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

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 10000 }));
            if (!url) return msg.channel.send(nourlEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send(novcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT')) return msg.channel.send(noconnectpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!permissions.has('SPEAK')) return msg.channel.send(nospeakpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            //queue limit
            const serverQueue = client.queue.get(msg.guild.id);
            if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) return msg.channel.send(queueLimit).then(msg => msg.delete({ timeout: 5000 }));
            //playlist url
            if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/gi)) {
                if (ytpl.validateID(url)) {
                    const playlist = await ytpl(url, {page: 1})
                    const videos = playlist.items;
                    for (const video of Object.values(videos)) {
                        const serverQueue = client.queue.get(msg.guild.id);
                        if (serverQueue && serverQueue.songs.length > config.music_queue_limit-1) {
                            msg.channel.send(playlistQueueLimit).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        handleVideo(video, msg, voiceChannel, true);
                    }
                } else return msg.channel.send(noresultEmbed).then(msg => msg.delete({ timeout: 5000 }));
            }
            //url
            else if (url.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
                try {
                    if (ytdl.validateURL(url)) {
                        await ytdl.getBasicInfo(url).then(video => {
                            var video = {
                                id: video.player_response.videoDetails.videoId,
                                title: video.player_response.videoDetails.title,
                                url: url
                            }
                            return handleVideo(video, msg, voiceChannel);
                        })
                    }
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(noresultEmbed).then(msg => msg.delete({ timeout: 5000 }));
                }       
            }
            //string
            else {
                try {
                    const result = (await ytsr(searchString, { limit: 10 })).items.filter(a => a.type === 'video');
                    return handleVideo(result[0], msg, voiceChannel);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(noresultEmbed).then(msg => msg.delete({ timeout: 5000 }));
                }
            }
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));

        async function handleVideo(video, msg, voiceChannel, playlist = false) {
            const serverQueue = client.queue.get(msg.guild.id);
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
                    volume: 100,
                    playing: true
                };
                client.queue.set(msg.guild.id, queueConstruct);
        
                queueConstruct.songs.push(song);
        
                try {
                    await voiceChannel.join()
                    .then(conn => {
                        conn.voice.setSelfDeaf(true);
                        queueConstruct.connection = conn;
                        });
                    play(msg.guild, queueConstruct.songs[0]);
                } catch (error) {
                    console.error(`I could not join the voice channel: ${error}`);
                    client.queue.delete(msg.guild.id);
        
                    const errjoinEmbed = new Discord.MessageEmbed()
                        .setColor('PURPLE')
                        .setTitle(":musical_note: Music")
                        .setDescription(`⛔ I couldn't join the voice channel: ${error}`)
        
                    return msg.channel.send(errjoinEmbed).then(msg => msg.delete({ timeout: 5000 }));
                }
            } else {
                
                const addtoqueueEmbed = new Discord.MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle(":musical_note: Music")
                    .setDescription(`✅ ${song.title} has been added to the queue`)
        
                serverQueue.songs.push(song);
                if (playlist) return undefined;
                else return msg.channel.send(addtoqueueEmbed).then(msg => msg.delete({ timeout: 5000 }));
            }
            return undefined;
        }
        
        function play(guild, song) {
            const serverQueue = client.queue.get(guild.id);
        
            if (!song) {
                serverQueue.voiceChannel.leave();
                client.queue.delete(guild.id);
                return;
            }
        
            const dispatcher = serverQueue.connection.play(ytdl(song.url, { filter: 'audioonly'}))
                .on('finish', reason => {
                    serverQueue.songs.shift();
                    play(guild, serverQueue.songs[0]);
                })
                .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
            
            const playEmbed = new Discord.MessageEmbed()
                .setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
                .setColor('PURPLE')
                .setTitle(`:musical_note: Music`)
                .setDescription(`:arrow_forward: **${song.title}**`)
            
            serverQueue.textChannel.send(playEmbed);       
        }
    }
}