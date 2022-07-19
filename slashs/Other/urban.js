const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);
const { URLSearchParams } = require(`url`);

module.exports = {
	name: `urban`,
	description: `Learn the meaning of urban words`,
	options: [
		{
			name: `text`,
			description: `Word or Sentence to look for`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 100,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const noresultEmbed = new Discord.EmbedBuilder()
			.setColor(`Red`)
			.setTitle(`⛔ Couldn't find any result`);

		try {
			const query = new URLSearchParams({ term: interaction.options.getString(`text`).toString() });
			const body = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());
			if (!body.list.length) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result)] });
			const data = body.list[Math.floor(Math.random() * body.list.length)];
			const embed = new Discord.EmbedBuilder()
				.setColor(0x32A8F0)
				.setAuthor({ name: LANG.author, iconURL: `https://i.imgur.com/Fo0nRTe.png`, url: `https://www.urbandictionary.com/` })
				.setURL(data.permalink)
				.setTitle(data.word)
				.setDescription((data.definition))
				.addFields([
					{
						name: LANG.example,
						value: data.example,
						inline: false,
					},
				]);
			return interaction.reply({ embeds: [embed] });
		} catch (err) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		}
	},
};
