const Discord = require(`discord.js`);

module.exports = {
	name: `pause`,
	description: `Pause current song`,
	options: null,
	run: async (client, interaction, LANG) => {

		const serverQueue = client.queue.get(interaction.guild.id);
		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			client.queue.get(interaction.guild.id).player.pause();

			const pauseEmbed = new Discord.EmbedBuilder()
				.setColor(`Purple`)
				.setTitle(LANG.title)
				.setDescription(LANG.paused);

			return interaction.reply({ embeds: [pauseEmbed] });
		}
		return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });
	},
};
