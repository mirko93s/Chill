const Discord = require(`discord.js`);

module.exports = {
	name: `tictactoe`,
	description: `Play tic-tac-toe with a friend`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`],
	options: [
		{
			name: `user`,
			description: `2nd player`,
			type: `USER`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const p1 = interaction.member;
		const p2 = interaction.options.getMember(`user`);
		let turn = `❌`;
		let _turn = 0;

		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor({ name: LANG.turn(p1.displayName, turn), iconURL: p1.displayAvatarURL() })
			.setTitle(LANG.title);

		const buttons = [];

		for (let i = 0; i < 9; i++) {
			buttons[i] = new Discord.MessageButton()
				.setCustomId((i + 1).toString())
				.setLabel(` `)
				.setStyle(`SECONDARY`);
		};

		const row1 = new Discord.MessageActionRow().addComponents(buttons[0], buttons[1], buttons[2]);
		const row2 = new Discord.MessageActionRow().addComponents(buttons[3], buttons[4], buttons[5]);
		const row3 = new Discord.MessageActionRow().addComponents(buttons[6], buttons[7], buttons[8]);

		interaction.reply({ embeds: [embed], components: [row1, row2, row3] }).then(() => {
			interaction.fetchReply().then(sent => {
				const filter = (i) => {
					i.deferUpdate();
					if (i.user.id === interaction.member.id || i.user.id === interaction.options.getMember(`user`).id) return true;
					else return false;
				};

				const collector = sent.createMessageComponentCollector({ filter, componentType: `BUTTON`, time: 60e3 });

				collector.on(`collect`, collected => {
					_turn++;
					// check turn
					if (turn === `❌` && collected.user.id !== p1.id) return;
					if (turn === `⭕` && collected.user.id !== p2.id) return;
					const id = collected.customId;
					buttons[id - 1].setEmoji(turn);
					buttons[id - 1].setDisabled(true);
					buttons[id - 1].setStyle(turn === `❌` ? `SUCCESS` : `PRIMARY`);
					// check win
					if (checkWin(buttons) === true) {
						collector.stop(`win`);
					} else if (_turn === 9) {
						collector.stop(`draw`);
					} else {
						collector.resetTimer({ time: 60e3 });
						if (turn == `❌`) {
							turn = `⭕`;
							embed.setAuthor({ name: `${p2.displayName}'s Turn ${turn}`, iconURL: p2.displayAvatarURL() });
						} else {
							turn = `❌`;
							embed.setAuthor({ name: `${p1.displayName}'s Turn ${turn}`, iconURL: p1.displayAvatarURL() });
						}
						sent.edit({ embeds: [embed], components: [row1, row2, row3] });
					}
				});
				collector.on(`end`, (collected, reason) => {
					if (reason === `win`) embed.setAuthor({ name: LANG.win(turn === `❌` ? p1.displayName : p2.displayName), iconURL: turn === `❌` ? p1.displayAvatarURL() : p2.displayAvatarURL() });
					else if (reason === `draw`) embed.setAuthor({ name: LANG.draw });
					else embed.setAuthor({ name: LANG.inactivity });
					for (let i = 0; i < 9; i++) { // disable all buttons
						buttons[i].setDisabled(true);
					};
					sent.edit({ embeds: [embed], components: [row1, row2, row3] });
				});
			});
		});
	},
};

function checkWin(buttons) {
	for (let i = 0; i < 3; i++) {
		// horizontal
		if (buttons[i * 3].emoji?.name === buttons[i * 3 + 1].emoji?.name && buttons[i * 3].emoji?.name === buttons[i * 3 + 2].emoji?.name) {
			if (buttons[i * 3].emoji && buttons[i * 3 + 1].emoji && buttons[i * 3 + 2].emoji) return true;
		}
		// vertical
		if (buttons[i].emoji?.name === buttons[i + 3].emoji?.name && buttons[i].emoji?.name === buttons[i + 6].emoji?.name) {
			if (buttons[i].emoji && buttons[i + 3].emoji && buttons[i + 6].emoji) return true;
		}
	}
	// ascending
	if (buttons[0].emoji?.name === buttons[4].emoji?.name && buttons[0].emoji?.name === buttons[8].emoji?.name) {
		if (buttons[0].emoji && buttons[4].emoji && buttons[8].emoji) return true;
	}
	// descending
	if (buttons[2].emoji?.name === buttons[4].emoji?.name && buttons[2].emoji?.name === buttons[6].emoji?.name) {
		if (buttons[2].emoji && buttons[4].emoji && buttons[6].emoji) return true;
	}
	return false;
}
