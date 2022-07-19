const Discord = require(`discord.js`);

module.exports = {
	name: `serveremojis`,
	description: `Returns a list with all the emojis in this server`,
	options: null,
	run: async (client, interaction, LANG) => {

		const emojiEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(LANG.title);

		let emojis = await interaction.guild.emojis.cache.map((e) => `${e}`).join(` `).toString();
		if (emojis.length < 1) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_emojis)] });
		} else if (emojis.length > 4096) {
			emojis = emojis.slice(0, 4096).split(` `);
			if (!emojis[emojis.length - 1].endsWith(`>`)) emojis = emojis.splice(0, emojis.length - 1).join(` `);
			emojiEmbed.setFooter({ text: LANG.trimmed });
		}
		emojiEmbed.setDescription(emojis.replace(/\s/g, ``));
		interaction.reply({ embeds: [emojiEmbed] });
	},
};
