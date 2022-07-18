const Discord = require(`discord.js`);
const { getVoiceConnection } = require (`@discordjs/voice`);

module.exports = {
	name: `stop`,
	description: `Stop music and kick bot out of the channel`,
	options: null,
	run: async (client, interaction, LANG) => {

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		if (getVoiceConnection(interaction.guild.id)) {
			client.queue.get(interaction.guild.id).songs = [];
			client.queue.get(interaction.guild.id).player.stop();

			const stopEmbed = new Discord.EmbedBuilder()
				.setColor(`Purple`)
				.setTitle(LANG.title)
				.setDescription(LANG.stopped);

			return interaction.reply({ ephemeral: true, embeds: [stopEmbed] });
		} else {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });
		}
	},
};
