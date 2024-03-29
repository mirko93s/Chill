const Discord = require(`discord.js`);
const figlet = require(`figlet`);

module.exports = {
	name: `ascii`,
	description: `Convert any string to Ascii Art`,
	options: [
		{
			name: `text`,
			description: `Text to convert to ascii art`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 50,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const string = interaction.options.getString(`text`).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ``); // remove emojis

		figlet.text(string, {
			font: `Standard`,
			horizontalLayout: `default`,
			verticalLayout: `default`,
			width: 120,
			whitespaceBreak: true,
		}, function(err, data) {
			if (err) {
				interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error)] });
				return console.log(err);
			}
			return interaction.reply({ content: `\`\`\`console\n${data}\`\`\`` });
		});
	},
};