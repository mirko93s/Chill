const Discord = require(`discord.js`);

module.exports = {
	name: `volume`,
	description: `Set music volume (default: 100%)`,
	userPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `volume`,
			description: `Set new volume`,
			type: `INTEGER`,
			minValue: 1,
			maxValue: 1000,
		},
	],
	run: async (client, interaction, LANG) => {

		const newvolume = interaction.options.getInteger(`volume`);

		const serverQueue = client.queue.get(interaction.guild.id);
		if (!serverQueue) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });

		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });

		const currentvolumeEmbed = new Discord.MessageEmbed()
			.setColor(`PURPLE`)
			.setTitle(LANG.title)
			.setDescription(LANG.volume(serverQueue.volume));

		if (!newvolume) return interaction.reply({ embeds: [currentvolumeEmbed] });

		serverQueue.volume = newvolume;
		client.queue.get(interaction.guild.id).player.state.resource.volume.setVolume(newvolume / 100);

		const newvolumeEmbed = new Discord.MessageEmbed()
			.setColor(`PURPLE`)
			.setTitle(LANG.title)
			.setDescription(LANG.new_volume(newvolume));

		return interaction.reply({ embeds: [newvolumeEmbed] });
	},
};
