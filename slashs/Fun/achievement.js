const Discord = require(`discord.js`);
const superagent = require(`superagent`);

module.exports = {
	name: `achievement`,
	description: `Generate a Minecraft-style achievement`,
	options: [
		{
			name: `description`,
			description: `Achievement description, max 25 characters`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: `icon`,
			description: `Choose an icon. Defaults to "Grass"`,
			type: Discord.ApplicationCommandOptionType.Integer,
			choices: [
				{ name: `Grass`, value: 1 },
				{ name: `Stone`, value: 20 },
				{ name: `Crafting Table`, value: 13 },
				{ name: `Furnace`, value: 18 },
				{ name: `Chest`, value: 17 },
				{ name: `Cobweb`, value: 16 },
				{ name: `Bed`, value: 9 },
				{ name: `Coal`, value: 31 },
				{ name: `Iron`, value: 22 },
				{ name: `Gold`, value: 23 },
				{ name: `Redstone`, value: 14 },
				{ name: `Diamond`, value: 2 },
				{ name: `Book`, value: 19 },
				{ name: `Bow`, value: 33 },
				{ name: `Diamond Sword`, value: 3 },
				{ name: `Diamond Chestplate`, value: 26 },
				{ name: `TNT`, value: 6 },
				{ name: `Flint And Steel`, value: 27 },
				{ name: `Fire`, value: 15 },
				{ name: `Water Bucket`, value: 37 },
				{ name: `Cake`, value: 10 },
				{ name: `Potion`, value: 28 },
				{ name: `Heart`, value: 8 },
				{ name: `Creeper`, value: 4 },
				{ name: `Pig`, value: 5 },
			],
		},
		{
			name: `title`,
			description: `Achievement title, max 25 characters. Defaults to "Achievement Unlocked!"`,
			type: Discord.ApplicationCommandOptionType.String,
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getString(`title`)?.length > 25 || interaction.options.getString(`description`).length > 25) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_long)] });

		try {
			const { body } = await superagent
				.get(`https://www.minecraftskinstealer.com/achievement/a.php`)
				.query({
					i: interaction.options.getInteger(`icon`) || 1,
					h: interaction.options.getString(`title`) || LANG.deafult_title,
					t: interaction.options.getString(`description`),
				});
			return interaction.reply({ files: [{ attachment: body, name: `achievement.png` }] });
		} catch (err) {
			interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error)] });
			return console.log(err);
		}
	},
};
