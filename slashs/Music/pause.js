const Discord = require("discord.js");

module.exports = {
    name: "pause",
    description: "Pause current song",
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

        const serverQueue = client.queue.get(interaction.guild.id);
        if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, "djrole"))) && client.settings.get(interaction.guild.id, 'djrequired') === 'true') return interaction.reply({ephemeral:true, embeds:[noDJroleEmbed]});
        if (client.settings.get(interaction.guild.id, "musicchannelonly") === "true" && interaction.channel.id !== client.settings.get(interaction.guild.id, "musictextchannel")) return interaction.reply({ephemeral:true, embeds:[mconlyEmbed]});
        if (!interaction.member.voice.channel) return interaction.reply({ephemeral:true, embeds:[notinvcEmbed]});
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            client.queue.get(interaction.guild.id).player.pause();

            const pauseEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`⏸ Paused`)

            return interaction.reply({embeds:[pauseEmbed]});
        }
        return interaction.reply({ephemeral:true, embeds:[noplayingEmbed]});
    }
}
