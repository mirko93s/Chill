const Discord = require(`discord.js`);
const ms = require(`ms`);

module.exports = {
	name: `giveaway`,
	description: `Host a Giveaway`,
	userPerms: [`ManageGuild`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`, `AddReactions`, `ReadMessageHistory`],
	options: [
		{
			name: `time`,
			description: `Time (automatically caps at approximately 25 days)`,
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
				{
					name: `seconds`,
					value: `s`,
				},
				{
					name: `minutes`,
					value: `m`,
				},
				{
					name: `hours`,
					value: `h`,
				},
				{
					name: `days`,
					value: `d`,
				},
			],
		},
		{
			name: `prize`,
			description: `What will the prize be?`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: `winners`,
			description: `How many winners? If blank defaults to 1`,
			type: Discord.ApplicationCommandOptionType.Integer,
			minValue: 1,
			maxValue: 10,
		},
		{
			name: `channel`,
			description: `Channel to start the Giveaway in. If blank defaults to Guild Config Giveaway channel`,
			type: Discord.ApplicationCommandOptionType.Channel,
			channelTypes: [Discord.ChannelType.GuildText],
		},
	],
	run: async (client, interaction, LANG) => {

		const gachannel = interaction.options.getChannel(`channel`) || interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `gachannel`)));
		if (!gachannel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_channel)] });
		let time = ms(interaction.options.getInteger(`time`) + interaction.options.getString(`unit`));
		time > 2147483647 ? time = 2147483647 : time = time;
		const prize = interaction.options.getString(`prize`);
		if (prize.length > 250) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });
		let winnersnum = interaction.options.getInteger(`winners`) || 1;
		const host = interaction.user;

		try {
			const startEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(LANG.started)
				.setDescription(LANG.react)
				.addFields([
					{
						name: LANG.prize,
						value: `**${prize}**`,
						inline: false,
					},
					{
						name: LANG.ends_at(((Date.now() + time) / 1e3).toFixed()),
						value: LANG.max_winners(winnersnum),
						inline: false,
					},
				])
				.setFooter({ text: LANG.footer_start(host.tag), iconURL: host.displayAvatarURL() })
				.setTimestamp();
			gachannel.send({ embeds: [startEmbed] }).then(sent => {
				client.intervals.set(`giveaways`, { timestamp: Date.now() + time, channel: gachannel.id }, sent.id);
				const doneEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setDescription(LANG.success(gachannel));
				interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
				sent.react(`🎉`);
				setTimeout(() => {
					sent.reactions.cache.get(`🎉`).users.fetch().then(r => {
						if (r.size < winnersnum) winnersnum = r.size;
						const winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
						const endEmbed = new Discord.EmbedBuilder()
							.setColor(`Random`)
							.setTitle(LANG.ended)
							.addFields([
								{
									name: LANG.prize,
									value: `**${prize}**`,
									inline: false,
								},
								{
									name: winner.length > 1 ? LANG.winners_key_p : LANG.winners_key_s,
									value: winner == 0 ? LANG.no_participants : winner.toString(),
									inline: false,
								},
							])
							.setFooter({ text: LANG.footer_end(host.tag), iconURL: host.displayAvatarURL() })
							.setTimestamp();
						sent.edit({ embeds: [endEmbed] });
						if (winner == 0) return;
						else gachannel.send(LANG.winner_msg(winner, prize));
					});
					client.intervals.delete(`giveaways`, sent.id);
				}, time);
			});
		} catch (err) {
			interaction.reply({ embeds: [client.chill.error(LANG.error)] });
			return console.error(err);
		}
	},
};