const Discord = require(`discord.js`);

module.exports = {
	name: `qr`,
	description: `Generate a qr code with a given text`,
	options: [
		{
			name: `text`,
			description: `Usually a link`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 512,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const text = interaction.options.getString(`text`);

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setDescription(text)
			.setImage(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${text.replace(/\s/g, `%20`)}`);
		return interaction.reply({ embeds: [embed] });
	},
};