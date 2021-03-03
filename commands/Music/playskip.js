const Discord = require("discord.js");
const {Util} = require("discord.js");
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const config = require('../../config.json');
const GOOGLE_API_KEY = config.google_api_key
const youtube = new YouTube(GOOGLE_API_KEY);

module.exports = {
    name: "playskip",
    aliases: ["ps"],
    category: "Music",
    description: "Play a song skipping all the queue",
    usage: "playskip <song name | playlist name | yt link | yt playlist>\n**e.g.**\n\`playskip best song ever\`\n> Like the \"play\" command. But if you have more songs in the queue this command will delete the whole queue and play the song you have just requested",
    run: async (client, msg) => {

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
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)

        const arg = msg.content.split(' ');
        let searchString = arg.slice(1).join(' ');
        let url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
        const serverQueue = client.queue.get(msg.guild.id);

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 10000 }));
            if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));
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
                handleVideo(video, msg, voiceChannel);
                serverQueue.songs = serverQueue.songs.slice(-2); //clear queue except last 2 songs
                serverQueue.connection.dispatcher.end(); //skip to next/last song
            }           
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));

        async function handleVideo(video, msg, voiceChannel, playlist = false) {
            const serverQueue = client.queue.get(msg.guild.id);
            const song = {
                id: video.id,
                title: Util.escapeMarkdown(video.title),
                url: `https://www.youtube.com/watch?v=${video.id}`
            };
            serverQueue.songs.push(song);
            if (playlist) return undefined;
            return undefined;
        }
    }
}