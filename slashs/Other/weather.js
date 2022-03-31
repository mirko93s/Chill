const Discord = require(`discord.js`);
const weather = require(`weather-js`);

module.exports = {
	name: `weather`,
	description: `Check the weather`,
	options: [
		{
			name: `city`,
			description: `City to get weather of`,
			type: `STRING`,
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
			if (result === undefined || result.length === 0 || err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_location)] });
			console.log(result);
			const current = result[0].current;
			const embed = new Discord.MessageEmbed()
				.setDescription(`**${current.skytext.toUpperCase()}**`)
				.setAuthor({ name: LANG.author })
				.setTitle(`${current.observationpoint} <t:${Date.parse(`${current.date} ${current.observationtime}`) / 1e3}:D>`)
				.setThumbnail(current.imageUrl)
				.setColor(0x00AE86)
				.addField(LANG.temperature, `${current.temperature} °C | ${Math.round(current.temperature * 1.8) + 32} °F`, true)
				.addField(LANG.feels_like, `${current.feelslike} °C | ${Math.round(current.feelslike * 1.8) + 32} °F`, true)
				.addField(`${LANG.low} ${result[0].forecast[1].low} °C | ${Math.round(result[0].forecast[1].low * 1.8) + 32} °F`, `${LANG.high} ${result[0].forecast[1].high} °C | ${Math.round(result[0].forecast[1].high * 1.8) + 32} °F`, true)
				.addField(LANG.wind, `${windDirection[current.winddisplay.split(` `)[2]]} ${current.windspeed} | ${(current.windspeed.replace(/\D/g, ``) / 1.609).toFixed()} mp/h`, true)
				.addField(LANG.humidity, `${current.humidity}%`, true)
				.addField(LANG.precipitations, `${result[0].forecast[1].precip}%`, true);

			for (let i = 2; i < 5; i++) {
				const f = result[0].forecast[i];
				embed.addField(`<t:${Date.parse(f.date) / 1e3}:D>`, LANG.forecast(f), true);
			}
			return interaction.reply({ embeds: [embed] });
		});
	},
};