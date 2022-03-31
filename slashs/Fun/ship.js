const Discord = require(`discord.js`);

module.exports = {
	name: `ship`,
	description: `Ship 2 Users to check the affinity between them`,
	options: [
		{
			name: `user1`,
			description: `Select 1st user`,
			type: `USER`,
			required: true,
		},
		{
			name: `user2`,
			description: `Select 2nd user`,
			type: `USER`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const user1 = interaction.options.getMember(`user1`);
		const user2 = interaction.options.getMember(`user2`);
		const ship = Math.floor(Math.random() * 100) + 1;

		let bar = ``;
		for (let i = 0; i < Math.round(ship / 10) ; i++) {
			bar += `⬜`;
		}
		for (let i = 0; i < 10 - Math.round(ship / 10) ; i++) {
			bar += `🔳`;
		}

		const shipEmbed = new Discord.MessageEmbed()
			.setFooter({ text: `${bar} ${ship}%` });

		switch (true) {
			case (ship >= 0 && ship <= 19):
				shipEmbed
					.setColor(`640000`)
					.setTitle(LANG.title(`💔`))
					.setDescription(LANG[`0`](user1, user2));
				break;
			case (ship >= 20 && ship <= 49):
				shipEmbed
					.setColor(`960000`)
					.setTitle(LANG.title(`❤️`))
					.setDescription(LANG[`20`](user1, user2));
				break;
			case (ship >= 50 && ship <= 89):
				shipEmbed
					.setColor(`C80000`)
					.setTitle(LANG.title(`💓`))
					.setDescription(LANG[`50`](user1, user2));
				break;
			case (ship >= 90 && ship <= 100):
				shipEmbed
					.setColor(`FA0000`)
					.setTitle(LANG.title(`💗`))
					.setDescription(LANG[`90`](user1, user2));
				break;
		};
		interaction.reply({ embeds: [shipEmbed] });
	},
};
