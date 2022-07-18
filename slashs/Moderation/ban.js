const Discord = require(`discord.js`);

module.exports = {
	name: `ban`,
	description: `Ban someone from your server`,
	userPerms: [`BAN_MEMBERS`],
	botPerms: [`VIEW_CHANNEL`, `BAN_MEMBERS`, `SEND_MESSAGES`, `EMBED_LINKS`],
	options: [
		{
			name: `user`,
			description: `User to ban`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: `reason`,
			description: `Reason of the ban`,
			type: Discord.ApplicationCommandOptionType.String,
		},
		{
			name: `deletemessages`,
			description: `Number of days of messages to delete`,
			type: Discord.ApplicationCommandOptionType.Integer,
			minValue: 1,
			maxValue: 7,
		},
		{
			name: `logchannel`,
			description: `Choose where to log this ban. If blank defaults to Guild Config Punishments channel`,
			type: Discord.ApplicationCommandOptionType.Channel,
			channelTypes: [Discord.ChannelType.GuildText],
		},
	],
	run: async (client, interaction, LANG) => {

		const puchannel = interaction.options.getChannel(`logchannel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `puchannel`)));
		if (!puchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const toBan = interaction.options.getMember(`user`);
		if (!toBan) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_in_guild)] });

		if (toBan.id === interaction.member.id) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_self)] });
		if (!toBan.bannable) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.hierarchy)] });

		const reason = interaction.options.getString(`reason`)?.substring(0, 1024) || LANG.not_provided;

		const banEmbed = new Discord.EmbedBuilder()
			.setColor(`Red`)
			.setThumbnail(toBan.user.displayAvatarURL())
			.setTitle(LANG.title)
			.setDescription(toBan.user.tag)
			.addFields([
				{
					name: LANG.by,
					value: interaction.member.user.username,
					inline: true,
				},
				{
					name: LANG.reason,
					value: reason,
					inline: false,
				},
			])
			.setTimestamp();

		toBan.ban({ days: 0, reason: reason }).catch(err => {
			if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		});
		const doneEmbed = new Discord.EmbedBuilder()
			.setColor(`Red`)
			.setDescription(LANG.banned(toBan, puchannel));
		interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
		return puchannel.send({ embeds: [banEmbed] });
	},
};
