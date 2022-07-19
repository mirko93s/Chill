const Discord = require(`discord.js`);
const apikey = require(`../../config.json`).weather_key;
const fetch = require(`node-fetch`);

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

		await interaction.deferReply();

		const city = interaction.options.getString(`city`);

		fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&aqi=yes&days=3`).then(response => {
			switch (response.status) {
				case 200: // OK
					try {
						response.json().then(json => {
							const weatherEmbed = new Discord.EmbedBuilder()
								.setAuthor({ name: LANG.author })
								.setTitle(`${json.location.name.toUpperCase()}, ${json.location.region}, ${json.location.country}`)
								.setDescription(`**${json.current.condition.text.toUpperCase()}**\n<t:${json.current.last_updated_epoch}>`)
								.setThumbnail(`http:` + json.current.condition.icon)
								.setColor(0x00AE86)
								.setFooter({ text: `Powered by WeatherAPI.com`, iconURL: `https://i.imgur.com/zjyRSzK.png` })
								.addFields([
									{
										name: LANG.temperature,
										value: `${json.current.temp_c.toFixed()} °C\n${json.current.temp_f.toFixed()} °F`,
										inline: true,
									},
									{
										name: LANG.feels_like,
										value: `${json.current.feelslike_c.toFixed()} °C\n${json.current.feelslike_f.toFixed()} °F`,
										inline: true,
									},
									{
										name: LANG.lowhigh,
										value: `${json.forecast.forecastday[0].day.mintemp_c.toFixed()}-${json.forecast.forecastday[0].day.maxtemp_c.toFixed()} °C\n${json.forecast.forecastday[0].day.mintemp_f.toFixed()}-${json.forecast.forecastday[0].day.maxtemp_f.toFixed()} °F`,
										inline: true,
									},
									{
										name: LANG.wind,
										value: `${json.current.wind_dir}\n${json.current.wind_kph.toFixed()} kph | ${json.current.wind_mph.toFixed()} mph`,
										inline: true,
									},
									{
										name: LANG.pressure,
										value: `${json.current.pressure_mb} mb\n${json.current.pressure_in} in`,
										inline: true,
									},
									{
										name: LANG.precipitations,
										value: `${json.forecast.forecastday[0].day.daily_chance_of_rain} %\n${json.current.precip_mm.toFixed()} mm | ${json.current.precip_in.toFixed()} in`,
										inline: true,
									},
									{
										name: LANG.humidity,
										value: `${json.current.humidity} %`,
										inline: true,
									},
									{
										name: LANG.airquality,
										value: `${LANG.airindexes[Math.ceil(json.current.air_quality[`gb-defra-index`] / 3)]} ${json.current.air_quality[`gb-defra-index`]}/10`,
										inline: true,
									},
									{
										name: LANG.uv,
										value: `${LANG.uvindexes[Math.floor(json.current.uv / 3)]} ${json.current.uv}`,
										inline: true,
									},
									{
										name: `\u200b`,
										value: `> **Forecast**`,
										inline: false,
									},
								]);

							for (let i = 1; i < 3; i++) {
								const f = json.forecast.forecastday[i];
								weatherEmbed.addFields([
									{
										name: `<t:${f.date_epoch}:D>`,
										value: LANG.forecast(f.day.condition.text, f.day.mintemp_c.toFixed(), f.day.mintemp_f.toFixed(), f.day.maxtemp_c.toFixed(), f.day.maxtemp_f.toFixed(), f.day.daily_chance_of_rain),
										inline: true,
									},
								]);
							}
							return interaction.followUp({ embeds: [weatherEmbed] });
						});
					} catch (err) {
						return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.no_location)] });
					}
					break;
				case 400: // bad request, probably invalid city
					return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.no_location)] });
					break;
				case 403: // rate limited, exceeded monthly quota
					return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.service_down)] });
					break;
			}
		});
	},
};

