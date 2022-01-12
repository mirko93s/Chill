const Discord = require("discord.js");

module.exports = {
    name: "queue",
    description: "Shows song queue list",
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
        if (serverQueue.songs.length < 1) return interaction.reply({ephemeral:true, embeds:[noplayingEmbed]});

        const queueEmbed = new Discord.MessageEmbed()
        .setColor('PURPLE')
        .setTitle(":musical_note: Music")
        .setDescription(`:twisted_rightwards_arrows: Queue:\n\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n\n🎶 **${serverQueue.songs[0].title}**`)

        return interaction.reply({embeds:[queueEmbed]});
    }
}
