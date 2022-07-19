const talkedRecently = new Set();
const Discord = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
	name: `bug`,
	description: `Report bugs to the dev. Please provide a good explanation and if possibile the steps to reproduce it`,
	options: null,
	run: async (client, interaction, LANG) => {

		if (talkedRecently.has(interaction.user.id)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.cooldown)] });

		const bugModal = new Discord.ModalBuilder()
			.setCustomId(`bug`)
			.setTitle(`Bug Report`);
		const _text = new Discord.TextInputBuilder()
			.setCustomId(`text`)
			.setLabel(`Explain the bug`)
			.setStyle(Discord.TextInputStyle.Paragraph)
			.setMinLength(50)
			.setMaxLength(4e3);
		const row1 = new Discord.ActionRowBuilder().addComponents([_text]);
		bugModal.addComponents([row1]);
		await interaction.showModal(bugModal);

		await interaction.awaitModalSubmit({
			time: 60e3,
			filter: i => i.user.id === interaction.user.id,
		}).then(modal => {
			const text = modal.fields.getTextInputValue(`text`);

			const bugembed = new Discord.EmbedBuilder()
				.setColor(`Red`)
				.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
				.setTitle(`🪲 Bug Report`)
				.setDescription(text)
				.setTimestamp();

			client.channels.cache.get(config.bugreport_channel).send({ embeds: [bugembed] }).then(sentEmbed => {
				sentEmbed.react(`✅`)
					.then (() => sentEmbed.react(`❔`))
					.then (() => sentEmbed.react(`❌`));
			});

			const thanksEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setTitle(LANG.success);
			modal.reply({ ephemeral: true, embeds: [thanksEmbed] });

			talkedRecently.add(interaction.user.id);
			setTimeout(() => {
				talkedRecently.delete(interaction.user.id);
			}, 30 * 60000);
		}).catch(err => {
			return console.log(err);
		});
	},
};
