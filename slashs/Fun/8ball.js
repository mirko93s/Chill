/* eslint-disable quotes */
const Discord = require(`discord.js`);

module.exports = {
	name: `8ball`,
	description: `Ask a question, the Bot will answer you`,
	options: [
		{
			name: `question`,
			description: `Ask a question`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 3072,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const fortunes = LANG.fortunes;

		const question = interaction.options.getString(`question`);
		const answer = fortunes[Math.floor(Math.random() * fortunes.length)];
		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(LANG.title)
			.setDescription(`*${question}*\n**${answer}**`);
		interaction.reply({ embeds: [embed] });
	},
};