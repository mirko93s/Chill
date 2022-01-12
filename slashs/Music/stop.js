const Discord = require("discord.js");
const { getVoiceConnection } = require ('@discordjs/voice');

module.exports = {
    name: "stop",
    description: "Stop music and kick bot out of the channel",
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
            .setDescription(`⚠️ Music Channel Only is active!\nYou can only use the music module in: <#${client.settings.get(interaction.guild.id, "musictextchannel")}>`)

        if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, "djrole"))) && client.settings.get(interaction.guild.id, 'djrequired') === 'true') return interaction.reply({ephemeral:true, embeds:[noDJroleEmbed]});
        if (client.settings.get(interaction.guild.id, "musicchannelonly") === "true" && interaction.channel.id !== client.settings.get(interaction.guild.id, "musictextchannel")) return interaction.reply({ephemeral:true, embeds:[mconlyEmbed]});
        if (!interaction.member.voice.channel) return interaction.reply({ephemeral:true, embeds:[notinvcEmbed]});
        if (getVoiceConnection(interaction.guild.id)) {
            client.queue.get(interaction.guild.id).songs = [];
            client.queue.get(interaction.guild.id).player.stop();

            const stopEmbed = new Discord.MessageEmbed()
                .setColor('PURPLE')
                .setTitle(":musical_note: Music")
                .setDescription(`:stop_button: Stopped`)

            return interaction.reply({ephemeral:true, embeds:[stopEmbed]});
        } else return interaction.reply({ephemeral:true, embeds:[noplayingEmbed]});
    }
}
