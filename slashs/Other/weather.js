const Discord = require(`discord.js`);
const weather = require(`weather-js`);

module.exports = {
	name: `weather`,
	description: `Check the weather`,
	options: [
		{
			name: `city`,
			description: `City to get weather of`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const windDirection = LANG.winds;

		weather.find({
			search: interaction.options.getString(`city`),
			degreeType: `C`,
			lang: `en_US`,
		}, function(err, result) {
			console.log(result);
			if (result === undefined || result.length === 0 || err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_location)] });
			const current = result[0].current;
			const embed = new Discord.EmbedBuilder()
				.setDescription(`**${current.skytext.toUpperCase()}**`)
				.setAuthor({ name: LANG.author })
				.setTitle(`${current.observationpoint} <t:${Date.parse(`${current.date} ${current.observationtime}`) / 1e3}:D>`)
				.setThumbnail(current.imageUrl)
				.setColor(0x00AE86)
				.addFields([
					{
						name: LANG.temperature,
						value: `${current.temperature} °C | ${Math.round(current.temperature * 1.8) + 32} °F`,
						inline: true,
					},
					{
						name: LANG.feels_like,
						value: `${current.feelslike} °C | ${Math.round(current.feelslike * 1.8) + 32} °F`,
						inline: true,
					},
					{
						name: `${LANG.low} ${result[0].forecast[1].low} °C | ${Math.round(result[0].forecast[1].low * 1.8) + 32} °F`,
						value: `${LANG.high} ${result[0].forecast[1].high} °C | ${Math.round(result[0].forecast[1].high * 1.8) + 32} °F`,
						inline: true,
					},
					{
						name: LANG.wind,
						value: `${windDirection[current.winddisplay.split(` `)[2]]} ${current.windspeed} | ${(current.windspeed.replace(/\D/g, ``) / 1.609).toFixed()} mp/h`,
						inline: true,
					},
					{
						name: LANG.humidity,
						value: `${current.humidity}%`,
						inline: true,
					},
					{
						name: LANG.precipitations,
						value: `${result[0].forecast[1].precip}%`,
						inline: true,
					},
				]);

			for (let i = 2; i < 5; i++) {
				const f = result[0].forecast[i];
				embed.addFields([
					{
						name: `<t:${Date.parse(f.date) / 1e3}:D>`,
						value: LANG.forecast(f.skytextday, f.low, (Math.round(f.low * 1.8) + 32), f.high, (Math.round(f.high * 1.8) + 32), f.precip.length > 0 ? f.precip : `0`),
						inline: true,
					},
				]);
			}
			return interaction.reply({ embeds: [embed] });
		});
	},
};

