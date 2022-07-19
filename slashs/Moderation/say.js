const Discord = require(`discord.js`);

module.exports = {
	name: `say`,
	description: `Let the bot say something for you`,
	userPerms: [`ManageMessages`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
		{
			name: `text`,
			description: `What do i have to say? (use \\n to create new lines)`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 2048,
			required: true,
		},
		{
			name: `embed`,
			description: `Send the message as embed`,
			type: Discord.ApplicationCommandOptionType.Boolean,
		},
		{
			name: `anonymous`,
			description: `If you want the bot message to be anonymous`,
			type: Discord.ApplicationCommandOptionType.Boolean,
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getBoolean(`anonymous`)) {
			const anonymousEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setDescription(LANG.success);
			interaction.reply({ ephemeral: true, embeds: [anonymousEmbed] });
		}
		let text = ``;
		interaction.options.getString(`text`).split(`\\n`).forEach(x => {
			text += x + `\n`;
		});

		const sayEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setDescription(text);

		if (interaction.options.getBoolean(`embed`)) {
			if (interaction.options.getBoolean(`anonymous`)) return interaction.channel.send({ embeds: [sayEmbed] });
			else return interaction.reply({ embeds: [sayEmbed] });
		} else if (interaction.options.getBoolean(`anonymous`)) {
			return interaction.channel.send({ content: text });
		} else {
			return interaction.reply({ content: text });
		}
	},
};