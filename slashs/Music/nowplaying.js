const Discord = require(`discord.js`);

module.exports = {
	name: `nowplaying`,
	description: `Shows current playing song`,
	options: null,
	run: async (client, interaction, LANG) => {

		const serverQueue = client.queue.get(interaction.guild.id);

		if (!interaction.member.roles.cache.some(role => role.id === (client.settings.get(interaction.guild.id, `djrole`))) && client.settings.get(interaction.guild.id, `djrequired`) === `true`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_dj)] });
		if (client.settings.get(interaction.guild.id, `musicchannelonly`) === `true` && interaction.channel.id !== client.settings.get(interaction.guild.id, `musictextchannel`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.mco(client.settings.get(interaction.guild.id, `musictextchannel`)))] });
		if (!interaction.member.voice.channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_vc)] });
		if (!serverQueue) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_playing)] });

		const nowplayingEmbed = new Discord.MessageEmbed()
			.setColor(`PURPLE`)
			.setTitle(LANG.title)
			.setDescription(`🎶 **${serverQueue.songs[0].title}**`);

		return interaction.reply({ embeds: [nowplayingEmbed] });
	},
};
