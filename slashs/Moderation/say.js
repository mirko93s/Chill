const Discord = require(`discord.js`);

module.exports = {
	name: `say`,
	description: `Let the bot say something for you`,
	userPerms: [`ManageMessages`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
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

		const sayModal = new Discord.ModalBuilder()
			.setCustomId(`bug`)
			.setTitle(`Say`);
		const _text = new Discord.TextInputBuilder()
			.setCustomId(`text`)
			.setLabel(`What should I say?`)
			.setStyle(Discord.TextInputStyle.Paragraph)
			.setMaxLength(2e3);
		const row1 = new Discord.ActionRowBuilder().addComponents([_text]);
		sayModal.addComponents([row1]);
		await interaction.showModal(sayModal);

		await interaction.awaitModalSubmit({
			time: 60e3,
			filter: i => i.user.id === interaction.user.id,
		}).then(modal => {
			const text = modal.fields.getTextInputValue(`text`);

			if (interaction.options.getBoolean(`anonymous`)) {
				const anonymousEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setDescription(LANG.success);
				modal.reply({ ephemeral: true, embeds: [anonymousEmbed] });
			}

			const sayEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setDescription(text);

			if (interaction.options.getBoolean(`embed`)) {
				if (interaction.options.getBoolean(`anonymous`)) return interaction.channel.send({ embeds: [sayEmbed] });
				else return modal.reply({ embeds: [sayEmbed] });
			} else if (interaction.options.getBoolean(`anonymous`)) {
				return interaction.channel.send({ content: text });
			} else {
				return modal.reply({ content: text });
			}
		}).catch(err => {
			return console.log(err);
		});
	},
};