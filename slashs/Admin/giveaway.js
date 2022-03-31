const Discord = require(`discord.js`);
const ms = require(`ms`);

module.exports = {
	name: `giveaway`,
	description: `Host a Giveaway`,
	userPerms: [`MANAGE_GUILD`],
	botPerms: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `EMBED_LINKS`, `ADD_REACTIONS`, `READ_MESSAGE_HISTORY`],
	options: [
		{
			name: `time`,
			description: `Time (automatically caps at approximately 25 days)`,
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
			type: `STRING`,
			required: true,
		},
		{
			name: `winners`,
			description: `How many winners? If blank defaults to 1`,
			type: `INTEGER`,
			minValue: 1,
			maxValue: 10,
		},
		{
			name: `channel`,
			description: `Channel to start the Giveaway in. If blank defaults to Guild Config Giveaway channel`,
			type: `CHANNEL`,
			channelTypes: [`GUILD_TEXT`],
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
			const startEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setTitle(LANG.started)
				.setDescription(LANG.react)
				.addField(LANG.prize, `**${prize}**`, false)
				.addField(LANG.ends_at(((Date.now() + time) / 1e3).toFixed()), LANG.max_winners(winnersnum))
				.setFooter({ text: LANG.footer_start(host.tag), iconURL: host.displayAvatarURL() })
				.setTimestamp();
			gachannel.send({ embeds: [startEmbed] }).then(sent => {
				client.intervals.set(`giveaways`, { timestamp: Date.now() + time, channel: gachannel.id }, sent.id);
				const doneEmbed = new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setDescription(LANG.success(gachannel));
				interaction.reply({ ephemeral: true, embeds: [doneEmbed] });
				sent.react(`🎉`);
				setTimeout(() => {
					sent.reactions.cache.get(`🎉`).users.fetch().then(r => {
						if (r.size < winnersnum) winnersnum = r.size;
						const winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
						const endEmbed = new Discord.MessageEmbed()
							.setColor(`RANDOM`)
							.setTitle(LANG.ended)
							.addField(LANG.prize, `**${prize}**`, false)
							.addField(LANG.winners_key(winner.length), LANG.winners_value(winner))
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