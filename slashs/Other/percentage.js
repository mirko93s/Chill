const Discord = require(`discord.js`);

module.exports = {
	name: `percentage`,
	description: `Calculate a percentage`,
	options: [
		{
			name: `x`,
			description: `First number`,
			type: `NUMBER`,
			required: true,
		},
		{
			name: `y`,
			description: `Second number`,
			type: `NUMBER`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const x = interaction.options.getNumber(`x`);
		const y = interaction.options.getNumber(`y`);

		try {
			const resultEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setTitle(LANG.title)
				.setDescription(LANG.description(x, y));
			return interaction.reply({ embeds: [resultEmbed] });
		} catch (err) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		}
	},
};
