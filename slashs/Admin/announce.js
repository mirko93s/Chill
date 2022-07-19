const Discord = require(`discord.js`);

module.exports = {
	name: `announce`,
	description: `Announce a message mentioning @everyone in the server`,
	userPerms: [`Administrator`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
		{
			name: `channel`,
			description: `Channel to send the announcement in. If blank defaults to Guild Config Broadcast channel`,
			type: Discord.ApplicationCommandOptionType.Channel,
			channelTypes: [Discord.ChannelType.GuildText, Discord.ChannelType.GuildNews],
		},
	],
	run: async (client, interaction, LANG) => {

		const announceModal = new Discord.ModalBuilder()
			.setCustomId(`announcement`)
			.setTitle(`Announcement`);
		const _title = new Discord.TextInputBuilder()
			.setCustomId(`title`)
			.setLabel(`Enter title`)
			.setStyle(Discord.TextInputStyle.Short)
			.setMaxLength(256);
		const _description = new Discord.TextInputBuilder()
			.setCustomId(`description`)
			.setLabel(`Enter description`)
			.setStyle(Discord.TextInputStyle.Paragraph)
			.setMaxLength(4e3);
		const row1 = new Discord.ActionRowBuilder().addComponents([_title]);
		const row2 = new Discord.ActionRowBuilder().addComponents([_description]);
		announceModal.addComponents([row1, row2]);

		await interaction.showModal(announceModal);

		await interaction.awaitModalSubmit({
			time: 60e3,
			filter: i => i.user.id === interaction.user.id,
		}).then(modal => {
			const title = modal.fields.getTextInputValue(`title`);
			const description = modal.fields.getTextInputValue(`description`);

			const bcEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
				.setTitle(title)
				.setDescription(description);

			const bcchannel = interaction.options.getChannel(`channel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `bcchannel`)));
			if (!bcchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });
			modal.reply({ ephemeral: true, embeds: [sentEmbed] });
			bcchannel.send(`@everyone`);
			bcchannel.send({ embeds: [bcEmbed] });
			const sentEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setDescription(LANG.success(bcchannel));
		}).catch(err => {
			interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.error)] });
			return console.log(err);
		});
	},
};
