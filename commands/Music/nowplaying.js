const Discord = require("discord.js");

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    category: "Music",
    description: "Return current playing song",
    usage: "nowplaying\n**e.g.**\n\`nowplaying\`\n> Wanna know the name of the song currently playing?\n> This is the right command",
    run: async (client, msg, arg) => {
        msg.delete();
        const serverQueue = client.queue.get(msg.guild.id);

        const noDJroleEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have DJ role`)
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)
        const mconlyEmbed = new Discord.MessageEmbed()
            .setColor(`RANDOM`)
            .setTitle(":musical_note: Music")
            .setDescription(`Music Channel Only is active!`)
            .setFooter(`You can only use the music module in: ${client.settings.get(msg.guild.id, "musicvocalchannel")}`)

        if (msg.member.roles.cache.some(role => role.name === (client.settings.get(msg.guild.id, "djrole")))) {
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.name !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!msg.member.voice.channel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));

            const nowplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`🎶 **${serverQueue.songs[0].title}**`)

            return msg.channel.send(nowplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
