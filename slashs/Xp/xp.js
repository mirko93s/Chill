const Discord = require(`discord.js`);

module.exports = {
	name: `xp`,
	description: `Change user's XP points`,
	userPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `user`,
			description: `User to change the xp to`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: `mode`,
			description: `Select a mode`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: `give`, value: `give` },
				{ name: `take`, value: `take` },
				{ name: `set`, value: `set` },
			],
		},
		{
			name: `amount`,
			description: `Amount of xp points`,
			type: Discord.ApplicationCommandOptionType.Integer,
			required: true,
			minValue: 0,
		},
	],
	run: async (client, interaction, LANG) => {

		if (client.settings.get(interaction.guild.id, `xpmodule`) === `false`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.disabled)] });
		const user = interaction.options.getMember(`user`);
		const pointsToAdd = interaction.options.getInteger(`amount`);
		client.settings.ensure(interaction.guild.id, { level: 0, points: 0 }, `xp.${user.id}`);
		const userScore = client.settings.get(interaction.guild.id, `xp.${user.id}`);
		let newPoints = 0;
		let xpmsg = ``;

		switch (interaction.options.getString(`mode`)) {
			case `give`:
				newPoints = userScore.points + pointsToAdd;
				xpmsg = `+`;
				break;
			case `take`:
				if (userScore.points - pointsToAdd < 0) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_negative)] });
				newPoints = userScore.points - pointsToAdd;
				xpmsg = `-`;
				break;
			case `set`:
				newPoints = pointsToAdd;
				xpmsg = LANG.set_to;
				break;
		}

		const newLevel = Math.floor(0.3163 * Math.sqrt(newPoints));
		// check for level rewards to give or take
		const rewards = client.settings.get(interaction.guild.id, `rewards`);
		let unlocked = ``;
		if (newLevel > userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= newLevel && value > userScore.level) {
					const checkrole = interaction.guild.roles.cache.find(r => r.id === key); // check if role exists
					if (checkrole && interaction.guild.members.me.roles.highest.position > checkrole.rawPosition) { // give role checking hierarchy
						interaction.member.roles.add(checkrole.id);
						unlocked += `${interaction.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		} else if (newLevel < userScore.level) {
			for (const [key, value] of Object.entries(rewards)) {
				if (value <= userScore.level && value > newLevel) {
					const checkrole = interaction.guild.roles.cache.find(r => r.id === key); // check if role exists
					if (checkrole && interaction.guild.members.me.roles.highest.position > checkrole.rawPosition) { // remove role checking hierarchy
						interaction.member.roles.remove(checkrole.id);
						unlocked += `${interaction.guild.roles.cache.find(r => r.id === key).name}\n`;
					}
				}
			};
		}

		client.settings.set(interaction.guild.id, { level: newLevel, points: newPoints }, `xp.${user.id}`);
		const xpEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: LANG.author(user.username), iconURL: user.displayAvatarURL() })
			.setTitle(pointsToAdd > 1 || pointsToAdd == 0 ? LANG.title_p(xpmsg, pointsToAdd) : LANG.title_s(xpmsg, pointsToAdd))
			.setFooter({ text: LANG.by(interaction.user.username) });

		if (newLevel != userScore.level) xpEmbed.setTitle(pointsToAdd > 1 || pointsToAdd == 0 ? LANG.levelup_p(xpmsg, pointsToAdd, newLevel) : LANG.levelup_s(xpmsg, pointsToAdd, newLevel));
		if (unlocked.length > 0) {
			if (newLevel > userScore.level) xpEmbed.setDescription(LANG.unlocked(unlocked));
			else if (newLevel < userScore.level) xpEmbed.setDescription(LANG.taken(unlocked));
		}
		return interaction.reply({ embeds: [xpEmbed] });
	},
};