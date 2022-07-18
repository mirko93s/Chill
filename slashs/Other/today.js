const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

module.exports = {
	name: `today`,
	description: `Shows a random historycal fact happened on this day`,
	options: null,
	run: async (client, interaction, LANG) => {

		const text = await fetch(`http://history.muffinlabs.com/date`)
			.then(response => response.json());
		const events = text.data.Events;
		if (!events) {
			const noEventEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(text.date)
				.setDescription(LANG.boring_day);
			return interaction.reply({ embeds: [noEventEmbed] });
		} else {
			const event = events[Math.floor(Math.random() * events.length)];
			const embed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setURL(text.url)
				.setTitle(text.date)
				.setDescription(`${event.year}: ${event.text}`);
			return interaction.reply({ embeds: [embed] }).catch(console.error);
		}
	},
};