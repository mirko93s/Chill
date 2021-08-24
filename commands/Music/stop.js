const Discord = require("discord.js");
const { getVoiceConnection } = require ('@discordjs/voice');

module.exports = {
    name: "stop",
    category: "Music",
    description: "Stop music",
    usage: "stop\n**e.g.**\n\`stop\`\n> stops the music, delete the queue and disconnect the Bot from the voice channel",
    run: async (client, msg, arg) => {
        
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
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(msg.guild.id, "musictextchannel")}>`)

        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole")))) {
            const serverQueue = client.queue.get(msg.guild.id);
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send({embeds:[mconlyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10e3));
            if (!msg.member.voice.channel) return msg.channel.send({embeds:[notinvcEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
            if (serverQueue) serverQueue.songs = [];
            if (getVoiceConnection(msg.guild.id)) {
                getVoiceConnection(msg.guild.id).destroy();

                const stopEmbed = new Discord.MessageEmbed()
                    .setColor('PURPLE')
                    .setTitle(":musical_note: Music")
                    .setDescription(`:stop_button: Stopped`)

                return msg.channel.send({embeds:[stopEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
            } else return msg.channel.send({embeds:[noplayingEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        } else return msg.channel.send({embeds:[noDJroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
    }
}
