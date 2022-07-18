const Discord = require(`discord.js`);

module.exports = {
	name: `autovocal`,
	description: `Lock your Auto-Vocal channel and invite/kick people to/from it`,
	botPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `lock`,
			description: `Lock your auto-vocal channel so only the users you whitelist will be able to join`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
		},
		{
			name: `invite`,
			description: `Whitelist a friend in your auto-vocal channel`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `user`,
					description: `User to invite`,
					type: Discord.ApplicationCommandOptionType.User,
					required: true,
				},
			],
		},
		{
			name: `kick`,
			description: `Kick somoene out of your auto-vocal channel, removing him from the whitelist`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `user`,
					description: `User to kick`,
					type: Discord.ApplicationCommandOptionType.User,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const temprole = interaction.guild.roles.cache.find(r => r.name === (`av-${interaction.member.voice.channelId}`));

		switch (interaction.options.getSubcommand()) {
			case `lock`:
				if (temprole) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_locked)] });
				if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, `autovocalcloned`)) {
					if (interaction.member.voice.channel.name.includes(interaction.user.username)) {
						interaction.guild.roles.create({ name: `av-${interaction.member.voice.channelId}`, color: `000000` }).then(role => {
							interaction.guild.channels.cache.get(interaction.member.voice.channelId).members.forEach((member) => {
								member.roles.add(role.id);
							});
							interaction.member.voice.channel.permissionOverwrites.edit(role.id, {
								VIEW_CHANNEL: true,
								SPEAK: true,
								STREAM: true,
								CONNECT: true,
							});
							interaction.member.voice.channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
								VIEW_CHANNEL: false,
								SPEAK: false,
								CONNECT: false,
							});
						});
						const lockedEmbed = new Discord.EmbedBuilder()
							.setColor(`Random`)
							.setTitle(LANG.locked)
							.setDescription(LANG.locked_description);
						interaction.reply({ embeds: [lockedEmbed] });
					} else {
						return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_owner)] });
					}
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_in_av)] });
				}
				break;
			case `invite`:
				if (!temprole) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_locked)] });
				if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, `autovocalcloned`)) {
					if (interaction.member.roles.cache.find(r => r.name === (`av-` + interaction.member.voice.channelId))) {
						const invited = interaction.options.getMember(`user`);
						if (invited.roles.cache.some(r => r.id === temprole.id)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_whitelisted(invited))] });
						invited.roles.add(temprole.id);
						const invitedEmbed = new Discord.EmbedBuilder()
							.setColor(`Random`)
							.setDescription(LANG.whitelisted(invited))
							.setFooter({ text: LANG.by(interaction.user.username), iconURL: interaction.user.displayAvatarURL() });
						interaction.reply({ embeds: [invitedEmbed] });
					} else {
						return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_owner)] });
					}
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_in_av)] });
				}
				break;
			case `kick`:
				if (!temprole) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_locked)] });
				if (client.settings.includes(interaction.guild.id, interaction.member.voice.channelId, `autovocalcloned`)) {
					if (interaction.member.voice.channel.name.includes(interaction.user.username)) {
						const invited = interaction.options.getMember(`user`);
						if (!invited.roles.cache.some(r => r.id === temprole.id)) return interaction.reply({ ephemeral: true, emebds: [client.chill.error(LANG.not_whitelisted)] });
						invited.roles.remove(temprole.id);
						invited.voice.disconnect();
						const kickedEmbed = new Discord.EmbedBuilder()
							.setColor(`Random`)
							.setDescription(LANG.kicked(invited))
							.setFooter({ text: LANG.by(interaction.user.username), iconURL: interaction.user.displayAvatarURL() });
						interaction.reply({ embeds: [kickedEmbed] });
					} else {
						return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_owner)] });
					}
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.errorLANG.not_in_av] });
				}
				break;
		}
	},
};
