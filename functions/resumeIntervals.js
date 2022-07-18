const Discord = require(`discord.js`);
const CryptoJS = require(`crypto-js`);

module.exports = async function(client) {
	// resume remindme
	const reminders = client.intervals.get(`reminders`);
	function reminder(id, text) {
		const reminderEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(`**REMINDER**`)
			.setDescription(CryptoJS.AES.decrypt(text, require(`../config.json`).crypto_key).toString(CryptoJS.enc.Utf8));
		client.intervals.delete(`reminders`, id);
		client.users.fetch(id.split(`-`)[0]).then(user => {
			user.send({ embeds: [reminderEmbed] }).catch(() => {
				return;
			});
		});
	}
	for (const [id, text] of Object.entries(reminders)) {
		if (id.split(`-`)[1] < Date.now()) reminder(id, text);
		else setTimeout(reminder, id.split(`-`)[1] - Date.now(), id, text);
	}
	// resume giveaways
	const giveaways = client.intervals.get(`giveaways`);
	for (const [id, data] of Object.entries(giveaways)) {
		client.channels.fetch(data.channel).then(channel => {
			channel.messages.fetch(id).then(sent => {
				const embed_data = sent.embeds[0];
				const time = data.timestamp - Date.now();
				function gaEmbed() {
					// get translation
					LANG = client.lang(sent.guild.preferredLocale, `commands`, `giveaway`);
					sent.reactions.cache.get(`🎉`).users.fetch().then(r => {
						let winnersnum = embed_data.fields[1].value.split(`: `)[1];
						if (r.size < winnersnum) winnersnum = r.size;
						const winner = r.filter(u => u.id !== client.user.id).random(winnersnum);
						const endEmbed = new Discord.EmbedBuilder()
							.setColor(`Random`)
							.setTitle(LANG.ended)
							.addFields([
								{
									name: LANG.prize,
									value: embed_data.fields[0].value,
									inline: false,
								},
								{
									name: winner.length > 1 ? LANG.winners_key_p : LANG.winners_key_s,
									value: winner == 0 ? LANG.no_participants : winner.toString(),
									inline: false,
								},
							])
							.setFooter({ text: LANG.footer_end_resumeInterval_fn(embed_data.footer.text.split(`\n`)[0]), iconURL: embed_data.footer.iconURL })
							.setTimestamp();
						sent.edit({ embeds: [endEmbed] });
						if (winner == 0) return;
						else channel.send(LANG.winner_msg(winner, embed_data.fields[0].value));
					});
					client.intervals.delete(`giveaways`, id);
				}
				if (data.timestamp > Date.now()) setTimeout(gaEmbed, time);
				else gaEmbed();
			});
		});
	}
};