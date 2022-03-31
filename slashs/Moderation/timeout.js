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
			type: `SUB_COMMAND`,
			options: [
				{
					name: `user`,
					description: `User to timeout`,
					type: `USER`,
					required: true,
				},
				{
					name: `time`,
					description: `Timeout duration, automatically caps at 28 days`,
					type: `INTEGER`,
					required: true,
					minValue: 1,
					maxValue: 60,
				},
				{
					name: `unit`,
					description: `Time unit`,
					type: `STRING`,
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
					type: `STRING`,
				},
				{
					name: `logchannel`,
					description: `Choose where to log this timeout. If blank defaults to Guild Config Punishments channel`,
					type: `CHANNEL`,
					channelTypes: [`GUILD_TEXT`],
				},
			],
		},
		{
			name: `remove`,
			description: `Remove timeout from someone`,
			type: `SUB_COMMAND`,
			options: [
				{
					name: `user`,
					description: `User to remove the timeout from`,
					type: `USER`,
					required: true,
				},
				{
					name: `reason`,
					description: `Reason of the timeout removal`,
					type: `STRING`,
				},
				{
					name: `logchannel`,
					description: `Choose where to log this timeout. If blank defaults to Guild Config Punishments channel`,
					type: `CHANNEL`,
					channelTypes: [`GUILD_TEXT`],
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
			const timedoutEmbed = new Discord.MessageEmbed()
				.setColor(`YELLOW`)
				.setThumbnail(user.user.displayAvatarURL())
				.setTitle(LANG.title)
				.setDescription(user.user.tag)
				.addField(LANG.by, interaction.member.user.username, true)
				.addField(LANG.duration, ms(time, { long: true }), true)
				.addField(LANG.reason, reason, false)
				.setTimestamp();
			puchannel.send({ embeds: [timedoutEmbed] });
		} else {
			const notTimedoutEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setDescription(LANG.not_timed_out(user));
			if (!user.isCommunicationDisabled()) return interaction.reply({ ephemeral: true, embeds: [notTimedoutEmbed] });
			user.timeout(0, reason).catch(err => {
				if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
			});
			const removedEmbed = new Discord.MessageEmbed()
				.setColor(`YELLOW`)
				.setThumbnail(user.user.displayAvatarURL())
				.setTitle(LANG.removed_title)
				.setDescription(user.user.tag)
				.addField(LANG.by, interaction.member.user.username, true)
				.addField(LANG.reason, reason, false)
				.setTimestamp();
			puchannel.send({ embeds: [removedEmbed] });
		}

		const doneEmbed = new Discord.MessageEmbed()
			.setColor(`YELLOW`)
			.setDescription(LANG.description(user, interaction.options.getSubcommand(), puchannel));
		return interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
	},
};