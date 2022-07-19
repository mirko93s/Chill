const Discord = require(`discord.js`);

module.exports = {
	name: `queue`,
	description: `Shows song queue list`,
	options: null,
	run: async (client, interaction, LANG) => {

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		const serverQueue = client.queue.get(interaction.guild.id);
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		if (!serverQueue) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });

		const queueEmbed = new Discord.EmbedBuilder()
			.setColor(`Purple`)
			.setTitle(LANG.title)
			.setDescription(LANG.queue(serverQueue.songs.map(song => `**-** ${song.title}`).join(`\n`), serverQueue.songs[0].title));

		return interaction.reply({ embeds: [queueEmbed] });
	},
};
