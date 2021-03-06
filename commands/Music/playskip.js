const Discord = require("discord.js");
const {Util} = require("discord.js");
const config = require('../../config.json');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');

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
            .setDescription(`⛔ I could not obtain any search result or the link provided was invalid`)
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)
        const playlistQueueLimit = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ Some songs in the playlist were not added due to the queue limit`)

        const arg = msg.content.split(' ');
        let searchString = arg.slice(1).join(' ');
        let url = arg[1] ? arg[1].replace(/<(.+)>/g, '$1') : '';
        const serverQueue = client.queue.get(msg.guild.id);

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 10000 }));
            if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!url) return msg.channel.send(nourlEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const voiceChannel = msg.member.voice.channel;
            if (!voiceChannel) return msg.channel.send(novcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            const permissions = voiceChannel.permissionsFor(msg.client.user);
            if (!permissions.has('CONNECT')) return msg.channel.send(noconnectpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!permissions.has('SPEAK')) return msg.channel.send(nospeakpermEmbed).then(msg => msg.delete({ timeout: 5000 }));
            //playlist url
            if (url.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/gi)) {
                if (ytpl.validateID(url)) { //checkl if url is a valid playlist
                    const playlist = await ytpl(url, {page: 1})
                    const videos = playlist.items;
                    serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                    for (const video of Object.values(videos)) {
                        const serverQueue2 = client.queue.get(msg.guild.id);
                        if (serverQueue2 && serverQueue2.songs.length > config.music_queue_limit-1) {
                            msg.channel.send(playlistQueueLimit).then(msg => msg.delete({ timeout: 5000 }));
                            break;
                        }
                        handleVideo(video, msg, voiceChannel, true);
                    }
                    serverQueue.connection.dispatcher.end(); //skip to next/last song
                }
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
                            serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                            handleVideo(video, msg, voiceChannel);
                            return serverQueue.connection.dispatcher.end(); //skip to next/last song
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
                    serverQueue.songs = serverQueue.songs.slice(-1); //clear queue except last song
                    handleVideo(result[0], msg, voiceChannel);
                    return serverQueue.connection.dispatcher.end(); //skip to next/last song
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
            serverQueue.songs.push(song);
            if (playlist) return undefined;
            return undefined;
        }
    }
}