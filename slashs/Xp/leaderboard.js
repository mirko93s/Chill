const Discord = require(`discord.js`);

module.exports = {
	name: `leaderboard`,
	description: `Returns top 10 XP leaderboard`,
	options: null,
	run: async (client, interaction, LANG) => {

		client.settings.ensure(interaction.guild.id, { xp: {} });

		if (client.settings.get(interaction.guild.id, `xpmodule`) === `false`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.disabled)] });
		const users = client.settings.get(interaction.guild.id, `xp`); // get object
		const sorted = {};
		Object // sort object
			.keys(users).sort(function(a, b) {
				return users[b].points - users[a].points;
			})
			.forEach(function(key) {
				sorted[key] = users[key];
			});
		const top10 = Object.keys(sorted).map((key) => [key, sorted[key]]).splice(0, 10); // map and splice object
		let emojiposition = 0;
		const embed = new Discord.EmbedBuilder()
			.setAuthor({ name: LANG.author(interaction.guild.name), iconURL: interaction.guild.iconURL() })
			.setColor(0x00AE86);
		const emoji = [`🥇`, `🥈`, `🥉`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`, `8️⃣`, `9️⃣`, `🔟`];
		let pos4to10 = ``;
		for (const [user, data] of top10) {
			if (emojiposition === 0) {
				embed.setTitle(`${emoji[emojiposition]}**${client.users.cache.get(user).username}**\n> **Lvl ${data.level}** - ${client.chill.fancyNumber(data.points)} xp`, true);
			} else if (emojiposition === 1 || emojiposition === 2) {
				embed.addFields([
					{
						name: `${emoji[emojiposition]}**${client.users.cache.get(user).username}**`,
						value: `> **Lvl ${data.level}** - ${client.chill.fancyNumber(data.points)} xp`,
						inline: true,
					},
				]);
			} else if (emojiposition === 3) {
				pos4to10 = `${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${client.chill.fancyNumber(data.points)} xp`;
			} else {
				pos4to10 += `\n${emoji[emojiposition]}${client.users.cache.get(user).username}\n\tLvl ${data.level} - ${client.chill.fancyNumber(data.points)} xp`;
			}
			emojiposition++;
		}
		if (pos4to10.length > 1) embed.setFooter({ text: pos4to10 });
		return interaction.reply({ embeds: [embed] });
	},
};