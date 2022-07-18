const Discord = require(`discord.js`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `drop`,
	description: `Host a Drop`,
	userPerms: [`ManageGuild`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
		{
			name: `prize`,
			description: `What will the prize be?`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: `channel`,
			description: `Channel to send the drop to, if blank defaults to Guild Config Giveaway channel`,
			type: Discord.ApplicationCommandOptionType.Channel,
			channelTypes: [Discord.ChannelType.GuildText],
		},
	],
	run: async (client, interaction, LANG) => {

		const gachannel = interaction.options.getChannel(`channel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `gachannel`)));
		if (!gachannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const prize = interaction.options.getString(`prize`);
		if (prize.length > 3072) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

		const dropEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(LANG.title)
			.setDescription(LANG.prize(prize))
			.setFooter({ text: LANG.footer });

		const claimbutton = new Discord.ButtonBuilder()
			.setCustomId(`claim`)
			.setLabel(LANG.claim)
			.setStyle(Discord.ButtonStyle.Primary);
		let buttonrow = new Discord.ActionRowBuilder().addComponents(claimbutton);

		const doneEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setDescription(LANG.started(gachannel));
		interaction.reply({ ephemeral: true, embeds: [doneEmbed] });

		gachannel.send({ embeds: [dropEmbed], components: [buttonrow] }).then(sent => {
			const filter = (_interaction) => {
				_interaction.deferUpdate();
				if (!_interaction.user.bot) return true;
			};
			const collector = sent.createMessageComponentCollector({ filter, max: 1, componentType: Discord.ComponentType.Button });
			collector.on(`collect`, collected => {
				claimbutton.setLabel(LANG.claimed).setStyle(Discord.ButtonStyle.Secondary).setDisabled(true);
				buttonrow = new Discord.ActionRowBuilder().addComponents(claimbutton);

				const winnerEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setTitle(`🎁 Drop`)
					.setDescription(stripIndent`
                    ${LANG.prize(prize)}
                    ${LANG.winner} ${collected.user}
                    `);

				sent.edit({ embeds: [winnerEmbed], components: [buttonrow] });
			});
		});
	},
};