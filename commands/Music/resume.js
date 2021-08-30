const Discord = require("discord.js");

module.exports = {
    name: "resume",
    category: "Music",
    description: "Resume last song",
    usage: "resume\n**e.g.**\n\`resume\`\n> Resume the music stream",
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
        
        if (msg.member.roles.cache.some(role => role.id === (client.settings.get(msg.guild.id, "djrole"))) && client.settings.get(msg.guild.id, 'djrequired') === 'true') return msg.channel.send({embeds:[noDJroleEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        const serverQueue = client.queue.get(msg.guild.id);
        if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send({embeds:[mconlyEmbed]}).then(msg =>setTimeout(() => msg.delete(), 10e3));
        if (!msg.member.voice.channel) return msg.channel.send({embeds:[notinvcEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            client.queue.get(msg.guild.id).player.unpause();
            const resumeEmbed = new Discord.MessageEmbed()

            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`:play_pause: Resumed`)

            return msg.channel.send({embeds:[resumeEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
        }
        return msg.channel.send({embeds:[noplayingEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5e3));
    }
}
