const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

module.exports = {
	name: `calc`,
	description: `Calculator`,
	options: [
		{
			name: `expression`,
			description: `Expression to calculate`,
			type: `STRING`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		await interaction.deferReply();

		const expression = interaction.options.getString(`expression`);
		if (expression.length > 512) return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

		fetch(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(expression)}`).then(response => {
			switch (response.status) {
				case 200: // OK
					try {
						response.json().then(result => {
							const calcEmbed = new Discord.MessageEmbed()
								.setColor(`RANDOM`)
								.setTitle(LANG.title)
								.setDescription(`${expression} = **${result}**`);
							return interaction.followUp({ embeds: [calcEmbed] });
						}).catch(() => {
							return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.invalid)] });
						});
					} catch (err) {
						return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.invalid)] });
					}
					break;
				case 400: // BAD REQUEST
					return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.invalid)] });
					break;
				case 503: // SERVICE UNAVAILABLE
					return interaction.followUp({ ephemeral: true, embeds: [client.chill.error(LANG.service_down)] });
					break;
			}
		}).catch(() => {
			return;
		});
	},
};