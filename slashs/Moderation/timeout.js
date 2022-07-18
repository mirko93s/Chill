const Discord = require(`discord.js`);
const ms = require(`ms`);

module.exports = {
	name: `timeout`,
	description: `timemout someone in your server`,
	userPerms: [`MODERATE_MEMBERS`],
	botPerms: [`VIEW_CHANNEL`, `MODERATE_MEMBERS`, `SEND_MESSAGES`, `EMBED_LINKS`],
	options: [
		{
			name: `add`,
			description: `Time out someone`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `user`,
					description: `User to timeout`,
					type: Discord.ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: `time`,
					description: `Timeout duration, automatically caps at 28 days`,
					type: Discord.ApplicationCommandOptionType.Integer,
					required: true,
					minValue: 1,
					maxValue: 60,
				},
				{
					name: `unit`,
					description: `Time unit`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Seconds`, value: `s` },
						{ name: `Minutes`, value: `m` },
						{ name: `Hours`, value: `h` },
						{ name: `Days`, value: `d` },
					],
				},
				{
					name: `reason`,
					description: `Reason of the timeout`,
					type: Discord.ApplicationCommandOptionType.String,
				},
				{
					name: `logchannel`,
					description: `Choose where to log this timeout. If blank defaults to Guild Config Punishments channel`,
					type: Discord.ApplicationCommandOptionType.Channel,
					channelTypes: [Discord.ChannelType.GuildText],
				},
			],
		},
		{
			name: `remove`,
			description: `Remove timeout from someone`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `user`,
					description: `User to remove the timeout from`,
					type: Discord.ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: `reason`,
					description: `Reason of the timeout removal`,
					type: Discord.ApplicationCommandOptionType.String,
				},
				{
					name: `logchannel`,
					description: `Choose where to log this timeout. If blank defaults to Guild Config Punishments channel`,
					type: Discord.ApplicationCommandOptionType.Channel,
					channelTypes: [Discord.ChannelType.GuildText],
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const puchannel = interaction.options.getChannel(`logchannel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `puchannel`)));
		if (!puchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const user = interaction.options.getMember(`user`);
		if (!user) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_in_guild)] });
		if (user.id === interaction.member.id) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_self)] });
		if (!user.moderatable) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_moderatable(user))] });

		const reason = interaction.options.getString(`reason`)?.substring(0, 1024) || LANG.not_provided;

		if (interaction.options.getSubcommand() === `add`) {
			let time = ms(interaction.options.getInteger(`time`) + interaction.options.getString(`unit`));
			time > 2419200000 ? time = 2419200000 : time = time; // cap time at 28 days
			user.timeout(time, reason).catch(err => {
				if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
			});
			const timedoutEmbed = new Discord.EmbedBuilder()
				.setColor(`Yellow`)
				.setThumbnail(user.user.displayAvatarURL())
				.setTitle(LANG.title)
				.setDescription(user.user.tag)
				.addFields([
					{
						name: LANG.by,
						value: interaction.member.user.username,
						inline: true,
					},
					{
						name: LANG.duration,
						value: ms(time, { long: true }),
						inline: true,
					},
					{
						name: LANG.reason,
						value: reason,
						inline: false,
					},
				])
				.setTimestamp();
			puchannel.send({ embeds: [timedoutEmbed] });
		} else {
			const notTimedoutEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setDescription(LANG.not_timed_out(user));
			if (!user.isCommunicationDisabled()) return interaction.reply({ ephemeral: true, embeds: [notTimedoutEmbed] });
			user.timeout(0, reason).catch(err => {
				if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
			});
			const removedEmbed = new Discord.EmbedBuilder()
				.setColor(`Yellow`)
				.setThumbnail(user.user.displayAvatarURL())
				.setTitle(LANG.removed_title)
				.setDescription(user.user.tag)
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
			puchannel.send({ embeds: [removedEmbed] });
		}

		const doneEmbed = new Discord.EmbedBuilder()
			.setColor(`Yellow`)
			.setDescription(interaction.options.getSubcommand() === `add` ? LANG.timeout_added(user, puchannel) : LANG.timeout_removed(user, puchannel));
		return interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
	},
};