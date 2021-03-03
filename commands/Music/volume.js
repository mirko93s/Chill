const Discord = require("discord.js");

module.exports = {
    name: "volume",
    category: "Music",
    description: "Set music volume (default: 5)",
    permission: "ADMINISTRATOR",
    usage: "volume [value]\n**e.g.**\n\`volume\`\n> Get current volume value\n\`volume 10\`\n> Set volume to 10\n> Default value is 5, it is not reccomended to set too high values to avoid audio distortion\n> Values are logarithmic, so a small value increase will provide a big volume boost",
    run: async (client, msg, arg) => {
        
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)
        const nopermvolumeEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You don't have permission to use this!`)
        const notanumberEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ Please input a number to set the volume`)
            .setFooter(`Default volume is 5`)

        if (msg.member.hasPermission("ADMINISTRATOR")) {
            const serverQueue = client.queue.get(msg.guild.id);
            const newvolume = arg[0];

            if (!msg.member.voice.channel) return msg.channel.send(notinvcEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (!serverQueue) return msg.channel.send(noplayingEmbed).then(msg => msg.delete({ timeout: 5000 }));

            const currentvolumeEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`:speaker: Current volume: **${serverQueue.volume}**`)

            if (!newvolume) return msg.channel.send(currentvolumeEmbed).then(msg => msg.delete({ timeout: 5000 }));
            if (isNaN(newvolume)) return msg.channel.send(notanumberEmbed);
            serverQueue.volume = newvolume;

            const newvolumeEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`:speaker: New volume: **${newvolume}**`)

            serverQueue.connection.dispatcher.setVolumeLogarithmic(newvolume / 5);
            return msg.channel.send(newvolumeEmbed).then(msg => msg.delete({ timeout: 5000 }));
        } else return msg.channel.send(nopermvolumeEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}
