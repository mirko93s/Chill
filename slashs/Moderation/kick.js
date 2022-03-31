const Discord = require(`discord.js`);

module.exports = {
	name: `kick`,
	description: `Kick someone from your server`,
	userPerms: [`KICK_MEMBERS`],
	botPerms: [`VIEW_CHANNEL`, `KICK_MEMBERS`, `SEND_MESSAGES`, `EMBED_LINKS`],
	options: [
		{
			name: `user`,
			description: `User to kick`,
			type: `USER`,
			required: true,
		},
		{
			name: `reason`,
			description: `Reason of the kick`,
			type: `STRING`,
		},
		{
			name: `logchannel`,
			description: `Choose where to log this kick. If blank defaults to Guild Config Punishments channel`,
			type: `CHANNEL`,
			channelTypes: [`GUILD_TEXT`],
		},
	],
	run: async (client, interaction, LANG) => {

		const puchannel = interaction.options.getChannel(`logchannel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `puchannel`)));
		if (!puchannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });

		const toKick = interaction.options.getMember(`user`);
		if (!toKick) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_in_guild)] });

		if (toKick.id === interaction.member.id) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_self)] });
		if (!toKick.kickable) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.hierarchy)] });

		const reason = interaction.options.getString(`reason`)?.substring(0, 1024) || LANG.not_provided;

		const kickEmbed = new Discord.MessageEmbed()
			.setColor(`ORANGE`)
			.setThumbnail(toKick.user.displayAvatarURL())
			.setTitle(LANG.title)
			.setDescription(toKick.user.tag)
			.addField(LANG.by, interaction.member.user.username, true)
			.addField(LANG.reason, reason, false)
			.setTimestamp();

		toKick.kick({ reason: reason }).catch(err => {
			if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		});
		const doneEmbed = new Discord.MessageEmbed()
			.setColor(`ORANGE`)
			.setDescription(LANG.kicked(toKick, puchannel));
		interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
		return puchannel.send({ embeds: [kickEmbed] });
	},
};
