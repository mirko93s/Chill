const Discord = require(`discord.js`);

module.exports = {
	name: `skip`,
	description: `Skip to the next song`,
	options: null,
	run: async (client, interaction, LANG) => {

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		const serverQueue = client.queue.get(interaction.guild.id);
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		if (!serverQueue) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });

		client.queue.get(interaction.guild.id).player.stop();

		const skipEmbed = new Discord.MessageEmbed()
			.setColor(`PURPLE`)
			.setTitle(LANG.title)
			.setDescription(LANG.skipped);

		return interaction.reply({ embeds: [skipEmbed] });
	},
};
