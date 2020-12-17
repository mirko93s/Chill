const Discord = require("discord.js");

module.exports = {
    name: "resume",
    category: "Music",
    description: "Resume last song",
    usage: "resume\n**e.g.**\n\`resume\`\n> Resume the music stream",
    run: async (client, msg, arg) => {
        if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();
        
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
            if (serverQueue && !serverQueue.playing) {
                serverQueue.playing = true;
                serverQueue.connection.dispatcher.resume();
                const resumeEmbed = new Discord.MessageEmbed()

                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`:play_pause: Resumed`)

                return msg.channel.send(resumeEmbed).then(msg => msg.delete({ timeout: 5000 }));
            }
            return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
