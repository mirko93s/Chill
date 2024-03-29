const Discord = require(`discord.js`);
const ms = require(`ms`);

module.exports = {
	name: `slowmode`,
	description: `Enable/Disable slow-mode in the channel you are in`,
	userPerms: [`ManageChannels`],
	botPerms: [`ViewChannel`, `ManageChannels`],
	options: [
		{
			name: `delay`,
			description: `Select slow-mode delay`,
			type: Discord.ApplicationCommandOptionType.Integer,
			required: true,
			choices: [
				{ name: `OFF`, value: 0 },
				{ name: `5 seconds`, value: 5 },
				{ name: `10 seconds`, value: 10 },
				{ name: `15 seconds`, value: 15 },
				{ name: `30 seconds`, value: 30 },
				{ name: `1 minute`, value: 60 },
				{ name: `2 minutes`, value: 120 },
				{ name: `5 minutes`, value: 300 },
				{ name: `10 minutes`, value: 600 },
				{ name: `15 minutes`, value: 900 },
				{ name: `30 minutes`, value: 1800 },
				{ name: `1 hour`, value: 3600 },
				{ name: `2 hours`, value: 7200 },
				{ name: `6 hours`, value: 21600 },
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const delay = interaction.options.getInteger(`delay`);

		interaction.channel.setRateLimitPerUser(delay);

		const slowmoEmbed = new Discord.EmbedBuilder()
			.setColor(delay > 0 ? `Green` : `Red`)
			.setTitle(LANG.title)
			.setDescription(delay > 0 ? LANG.set_to(ms(delay * 1e3, { long: true })) : LANG.disabled);

		interaction.reply({ embeds: [slowmoEmbed] });

	},
};
