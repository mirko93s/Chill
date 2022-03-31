const Discord = require(`discord.js`);

module.exports = {
	name: `clear`,
	description: `Get rid of mutiple messages at once`,
	userPerms: [`MANAGE_MESSAGES`],
	botPerms: [`VIEW_CHANNEL`, `MANAGE_MESSAGES`, `READ_MESSAGE_HISTORY`],
	options: [
		{
			name: `amount`,
			description: `Number of messages to delete`,
			type: `INTEGER`,
			required: true,
			minValue: 2,
			maxValue: 100,
		},
	],
	run: async (client, interaction, LANG) => {

		const fetched = await interaction.channel.messages.fetch({ limit: interaction.options.getInteger(`amount`), before: interaction.id });

		await interaction.channel.bulkDelete(fetched, true).then(deleted => {
			const purgeEmbed = new Discord.MessageEmbed()
				.setColor(`GREEN`)
				.setTitle(LANG.success(deleted.size));
			if (fetched.size > deleted.size) purgeEmbed.setDescription(LANG.old);
			interaction.reply({ embeds: [purgeEmbed] });
		});
	},
};