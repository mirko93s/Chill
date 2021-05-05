const Discord = require("discord.js");

module.exports = {
    name: "skip",
    category: "Music",
    description: "Skip to the next song",
    usage: "skip\n**e.g.**\n\`skip\`\n> skip to the next song in the queue",
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
            if (client.settings.get(msg.guild.id, "musicchannelonly") === "true" && msg.channel.id !== client.settings.get(msg.guild.id, "musictextchannel")) return msg.channel.send(mconlyEmbed).then(msg => msg.delete({ timeout: 10000 }));
            if (!msg.member.voice.channel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));
            
            serverQueue.playing = true; //keep it otherwise skipping while paused will throw errors
            serverQueue.connection.dispatcher.end();

            const skipEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`:track_next: Skipped`)

            return msg.channel.send (skipEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send(noDJroleEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
