const Discord = require(`discord.js`);

module.exports = {
	name: `clear`,
	description: `Get rid of mutiple messages at once`,
	userPerms: [`ManageMessages`],
	botPerms: [`ViewChannel`, `ManageMessages`, `ReadMessageHistory`],
	options: [
		{
			name: `amount`,
			description: `Number of messages to delete`,
			type: Discord.ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 2,
			maxValue: 100,
		},
	],
	run: async (client, interaction, LANG) => {

		const fetched = await interaction.channel.messages.fetch({ limit: interaction.options.getInteger(`amount`), before: interaction.id });

		await interaction.channel.bulkDelete(fetched, true).then(deleted => {
			const purgeEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setTitle(LANG.success(deleted.size));
			if (fetched.size > deleted.size) purgeEmbed.setDescription(LANG.old);
			interaction.reply({ embeds: [purgeEmbed] });
		});
	},
};