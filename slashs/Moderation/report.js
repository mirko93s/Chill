const Discord = require(`discord.js`);
const { stripIndents } = require(`common-tags`);

module.exports = {
	name: `report`,
	description: `Report a member for breaking the rules (also available right-clicking a message)`,
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
		{
			name: `user`,
			description: `User to report`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: `reason`,
			description: `Why are you reporting this user?`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 3072,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {
		report(client, interaction, interaction.options.getMember(`user`), LANG);
	},
};

module.exports.message = {
	name: `Report`,
	type: Discord.ApplicationCommandType.Message,
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	contextdescription: `Report a message (and its author) for breaking the rules`,
	run: async (client, interaction, LANG) => {
		interaction.guild.members.fetch(interaction.targetMessage.author.id).then(reported => {
			report(client, interaction, reported, LANG, true);
		});
	},
};

async function report(client, interaction, reported, LANG, isMessage = false) {


	if (reported.user.bot) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_bots)] });
	if (reported.user.id === interaction.user.id) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_self)] });

	const reportchannel = interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `reportchannel`)));
	if (!reportchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

	const thanksEmbed = new Discord.EmbedBuilder()
		.setColor(`Green`)
		.setTitle(LANG.success(reported));
	interaction.reply({ ephemeral: true, embeds: [thanksEmbed] });

	const reportEmbed = new Discord.EmbedBuilder()
		.setColor(`#ff0000`)
		.setTimestamp()
		.setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

	if (!isMessage) {
		reportEmbed
			.setAuthor({ name: LANG.user_report, iconURL: reported.user.displayAvatarURL() })
			.setDescription(stripIndents`${LANG.member}
                > ${reported} \`${reported.user.id}\`
                ${LANG.by}
                > ${interaction.member}
                ${LANG.channel}
                > ${interaction.channel}
                ${LANG.reason}
                > ${interaction.options.getString(`reason`)}`);
	} else {
		reportEmbed
			.setAuthor({ name: LANG.message_report, iconURL: reported.user.displayAvatarURL() })
			.setDescription(stripIndents`${LANG.message_author}
                > ${reported} \`${reported.user.id}\`
                ${LANG.by}
                > ${interaction.member}
                ${LANG.channel}
                > ${interaction.channel}
                ${LANG.message}
                > [LINK](https://discord.com/channels/${interaction.targetMessage.guildId}/${interaction.targetMessage.channelId}/${interaction.targetMessage.id}/)`);

		if (interaction.targetMessage.content.length > 1e3) {
			reportEmbed.addFields([
				{
					name: LANG.preview,
					value: (content.length - 1e3) > 1 ? LANG.chars(interaction.targetMessage.content.slice(0, 1e3), (content.length - 1e3)) : LANG.char(interaction.targetMessage.content.slice(0, 1e3), (content.length - 1e3)),
					inline: false,
				},
			]);
		} else {
			reportEmbed.addFields([
				{
					name: LANG.preview,
					value: interaction.targetMessage.content,
					inline: false,
				},
			]);
		}
	}
	reportchannel.send({ embeds: [reportEmbed] });
}