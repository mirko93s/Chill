const Discord = require(`discord.js`);

module.exports = {
	name: `botactivity`,
	description: `Set Bot's activity`,
	dev: true,
	options: [
		{
			name: `type`,
			description: `Choose activity type`,
			type: `STRING`,
			required: true,
			choices: [
				{ name: `Playing`, value: `PLAYING` },
				{ name: `Streaming`, value: `STREMING` },
				{ name: `Listening`, value: `LISTENING` },
				{ name: `Watching`, value: `WATCHING` },
				{ name: `Competing`, value: `COMPETING` },
			],
		},
		{
			name: `activity`,
			description: `Set new activity, max 128 characters`,
			type: `STRING`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getString(`activity`).length > 128) return interaction.reply({ ephemeral: true, content: `⛔**ERROR** Activity must be long 128 characters or less` });

		const baEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(`Bot Activity Updated`);

		client.user.setActivity({ type: interaction.options.getString(`type`), name: interaction.options.getString(`activity`) });
		interaction.reply({ ephemeral: true, embeds: [baEmbed] });
	},
};