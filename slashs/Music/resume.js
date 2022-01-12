const Discord = require("discord.js");

module.exports = {
    name: "resume",
    description: "Resume last song",
    options: null,
    run: async (client, interaction, arg) => {
        
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
            .setDescription(`Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(interaction.guild.id, "musictextchannel")}>`)
        
        if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, "djrole"))) && client.settings.get(interaction.guild.id, 'djrequired') === 'true') return interaction.reply({ephemeral:true, embeds:[noDJroleEmbed]});
        const serverQueue = client.queue.get(interaction.guild.id);
        if (client.settings.get(interaction.guild.id, "musicchannelonly") === "true" && interaction.channel.id !== client.settings.get(interaction.guild.id, "musictextchannel")) return interaction.reply({ephemeral:true, embeds:[mconlyEmbed]});
        if (!interaction.member.voice.channel) return interaction.reply({ephemeral:true, embeds:[notinvcEmbed]});
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            client.queue.get(interaction.guild.id).player.unpause();
            const resumeEmbed = new Discord.MessageEmbed()

            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`:play_pause: Resumed`)

            return interaction.reply({embeds:[resumeEmbed]});
        }
        return interaction.reply({ephemeral:true, embeds:[noplayingEmbed]});
    }
}
