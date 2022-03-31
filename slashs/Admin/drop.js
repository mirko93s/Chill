const Discord = require(`discord.js`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `drop`,
	description: `Host a Drop`,
	userPerms: [`MANAGE_GUILD`],
	botPerms: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `EMBED_LINKS`],
	options: [
		{
			name: `prize`,
			description: `What will the prize be?`,
			type: `STRING`,
			required: true,
		},
		{
			name: `channel`,
			description: `Channel to send the drop to, if blank defaults to Guild Config Giveaway channel`,
			type: `CHANNEL`,
			channelTypes: [`GUILD_TEXT`],
		},
	],
	run: async (client, interaction, LANG) => {

		const gachannel = interaction.options.getChannel(`channel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `gachannel`)));
		if (!gachannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const prize = interaction.options.getString(`prize`);
		if (prize.length > 3072) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

		const dropEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title)
			.setDescription(LANG.prize, prize)
			.setFooter({ text: LANG.footer });

		const claimbutton = new Discord.MessageButton()
			.setCustomId(`claim`)
			.setLabel(LANGdrop.claim)
			.setStyle(`PRIMARY`);
		let buttonrow = new Discord.MessageActionRow().addComponents(claimbutton);

		const doneEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setDescription(LANG.started(gachannel));
		interaction.reply({ ephemeral: true, embeds: [doneEmbed] });

		gachannel.send({ embeds: [dropEmbed], components: [buttonrow] }).then(sent => {
			const filter = (_interaction) => {
				_interaction.deferUpdate();
				if (!_interaction.user.bot) return true;
			};
			const collector = sent.createMessageComponentCollector({ filter, max: 1, componentType: `BUTTON` });
			collector.on(`collect`, collected => {
				claimbutton.setLabel(LANG.claimed).setStyle(`SECONDARY`).setDisabled(true);
				buttonrow = new Discord.MessageActionRow().addComponents(claimbutton);

				const winnerEmbed = new Discord.MessageEmbed()
					.setColor(`RANDOM`)
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