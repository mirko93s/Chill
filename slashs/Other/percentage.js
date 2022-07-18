const Discord = require(`discord.js`);

module.exports = {
	name: `percentage`,
	description: `Calculate a percentage`,
	options: [
		{
			name: `x`,
			description: `First number`,
			type: Discord.ApplicationCommandOptionType.Number,
			required: true,
		},
		{
			name: `y`,
			description: `Second number`,
			type: Discord.ApplicationCommandOptionType.Number,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const x = interaction.options.getNumber(`x`);
		const y = interaction.options.getNumber(`y`);

		try {
			const resultEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(LANG.title)
				.setDescription(LANG.description(x, (x / y * 100).toFixed(2), y));
			return interaction.reply({ embeds: [resultEmbed] });
		} catch (err) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		}
	},
};
