const Discord = require("discord.js");

module.exports = {
    name: "volume",
    description: "Set music volume (default: 100%)",
    userPerms: ['ADMINISTRATOR'],
    options: [
        {
            name: 'volume',
            description: 'Set new volume',
            type: 'INTEGER',
            minValue: 1,
            maxValue: 1000,
        }
    ],
    run: async (client, interaction, arg) => {
        
        const noplayingEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ There is nothing playing`)
        const notinvcEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`⛔ You are not in a voice channel`)

        const newvolume = interaction.options.getInteger('volume');

        const serverQueue = client.queue.get(interaction.guild.id);
        if (!serverQueue) return interaction.reply({ephemeral:true, embeds:[noplayingEmbed]});

        if (!interaction.member.voice.channel) return interaction.reply({ephemeral:true, embeds:[notinvcEmbed]});

        const currentvolumeEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`:speaker: Current volume: **${serverQueue.volume} %**`)

        if (!newvolume) return interaction.reply({embeds:[currentvolumeEmbed]});
        
        serverQueue.volume = newvolume;
        client.queue.get(interaction.guild.id).player.state.resource.volume.setVolume(newvolume / 100);

        const newvolumeEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setTitle(":musical_note: Music")
            .setDescription(`:speaker: New volume: **${newvolume} %**`)

        return interaction.reply({embeds:[newvolumeEmbed]});
    }
}
