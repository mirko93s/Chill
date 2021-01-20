const Discord = require("discord.js");
const {Util} = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const config = require('../../config.json');
const GOOGLE_API_KEY = config.google_api_key
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
    name: "play",
    aliases: ["p"],
    category: "Music",
    description: "Play a song from Youtube",
    usage: "play <song name | playlist name | yt link | yt playlist>\n**e.g.**\n\`play best song ever\`\n> will search and play \"best song ever\" from Youtube\n> The result can either be a video or a playlist\n> Playlist will be played till the end of itself\n> You can also provide a direct link to the Youtube video/playlist",
    run: async (client, msg, MTC_state) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

        if (msg.author.id !== "278380909588381698") return msg.channel.send("Music is temporarily disabled. It will be back in a few days.").then(msg => msg.delete({ timeout: 5000 }));
        
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
            .setDescription(`⛔ I could not obtain any search results.`)

        let searchString;
        let url;
        const arg = msg.content.split(' ');
       
        if (MTC_state === true) {
            searchString = arg.slice(0).join(' ');
            url = arg[0] ? arg[0].replace(/<(.+)>/g, '$1') : '';
        } else {
            searchString = arg.slice(1).join(' ');
            url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
        }

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!url) return msg.channel.send(nourlEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send(novcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT')) return msg.channel.send(noconnectpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!permissions.has('SPEAK')) return msg.channel.send(nospeakpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
                const playlist = await youtube.getPlaylist(url);
                const videos = await playlist.getVideos();
                for (const video of Object.values(videos)) {
                    const video2 = await youtube.getVideoByID(video.id);
                    await handleVideo(video2, msg, voiceChannel, true);
                }
            } else {
                    try {
                        var video = await youtube.getVideo(url);
                    } catch (error) {
                        try {
                            var videos = await youtube.searchVideos(searchString, 10);
                            const videoIndex = 1;
                            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                        } catch (err) {
                            console.error(err);
                            return msg.channel.send(noresultEmbed).then(msg => msg.delete({ timeout: 5000 }));
                        }
                    }
                    return handleVideo(video, msg, voiceChannel);
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
                    volume: 5,
                    playing: true
                };
                client.queue.set(msg.guild.id, queueConstruct);
        
                queueConstruct.songs.push(song);
        
                try {
                    var connection = await voiceChannel.join();
                    queueConstruct.connection = connection;
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
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            
            const playEmbed = new Discord.MessageEmbed()
                .setImage(`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`)
                .setColor('PURPLE')
                .setTitle(`:musical_note: Music`)
                .setDescription(`:arrow_forward: **${song.title}**`)
            
            serverQueue.textChannel.send(playEmbed);       
        }
    }
}