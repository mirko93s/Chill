const Discord = require(`discord.js`);

module.exports = {
	name: `connect4`,
	description: `Play the classic Connect 4 game with a friend`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`, `ADD_REACTIONS`, `MANAGE_MESSAGES`, `READ_MESSAGE_HISTORY`],
	options: [
		{
			name: `user`,
			description: `2nd player`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const p1 = interaction.member;
		const p2 = interaction.options.getMember(`user`);

		const boardarray = [
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`, `⚪`],
			[`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`],
		];
		let turn = `🔴`;
		const boardEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: `${p1.displayName}'s Turn ${turn}`, iconURL: p1.displayAvatarURL() })
			.setTitle(LANG.title)
			.setDescription(boardToString(boardarray))
			.setFooter({ text: LANG.react });
		interaction.reply({ embeds: [boardEmbed] }).then(() => {
			interaction.fetchReply().then(sent => {
				// add reactions
				const reactions = [`1️⃣`, `2️⃣`, `3️⃣`, `4️⃣`, `5️⃣`, `6️⃣`, `7️⃣`];
				for (const reaction of reactions) sent.react(reaction);
				// create reaction collector and its filter
				const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && !user.bot && (user.id === p1.id || user.id === p2.id);
				const collector = sent.createReactionCollector({ filter, time: 60e3 });
				collector.on(`collect`, clicked => {

					const reactionUser = clicked.users.cache.filter(u => u.id !== client.user.id).first();
					clicked.users.remove(reactionUser);
					// check player turn
					if (turn === `🔴` && reactionUser.id !== p1.id) return;
					if (turn === `🟡` && reactionUser.id !== p2.id) return;

					if (reactions.includes(clicked.emoji.name)) collector.resetTimer({ time: 60e3 });
					let x = 0;
					const y = 0;
					// set column
					const emojiToNum = { '1️⃣': 0, '2️⃣': 1, '3️⃣': 2, '4️⃣': 3, '5️⃣': 4, '6️⃣': 5, '7️⃣': 6 };
					x = emojiToNum[clicked.emoji.name];
					// find an empty chip in that column
					for (let _y = 5; _y >= 0; _y--) {
						if (boardarray[_y][x] == `⚪`) {
							boardarray[_y][x] = turn;
							boardEmbed.setDescription(boardToString(boardarray));
							break;
						} else if (_y == 0 && boardarray[_y][x] != `⚪`) {
							return; // if column full return
						}
					}
					// //check if player won
					if (haswon(turn, boardarray, x, y) == true) {
						collector.stop(`hasWon`);
						boardEmbed.setAuthor({ name: LANG.won(turn === `🔴` ? p1.displayName : p2.displayName), iconURL: turn === `🔴` ? p1.displayAvatarURL() : p2.displayAvatarURL() });
						return sent.edit({ embeds: [boardEmbed] });
					} else if (checkDraw(boardarray) == true) {
						collector.stop(`draw`);
						boardEmbed.setAuthor({ name: LANG.draw });
						return sent.edit({ embeds: [boardEmbed] });
					} else if (turn == `🔴`) {
						turn = `🟡`;
						boardEmbed.setAuthor({ name: LANG.turn(player, turn), iconURL: p2.displayAvatarURL() });
					} else {
						turn = `🔴`;
						boardEmbed.setAuthor({ name: LANG.turn(player, turn), iconURL: p1.displayAvatarURL() });
					}
					return sent.edit({ embeds: [boardEmbed] });
				});
				collector.on(`end`, (collection, reason) => {
					sent.reactions.removeAll();
					if (reason == `time`) {
						boardEmbed.setAuthor({ name: LANG.inactivity });
						return sent.edit({ embeds: [boardEmbed] });
					}
				});
			});
		});
	},
};
function boardToString(board) { // convert board array to string
	let string = ``;
	for (let i = 0; i < board.length;i++) {
		string += `${board[i].join(` `)}`;
		if (i != board.length) string += `\n`;
	}
	return string;
}

function checkDraw(boardarray) {
	if (boardarray[0][0] != `⚪` && boardarray[0][1] != `⚪` && boardarray[0][2] != `⚪` && boardarray[0][3] != `⚪` && boardarray[0][4] != `⚪` && boardarray[0][5] != `⚪` && boardarray[0][6] != `⚪`) return true;
	else return false;
}

function haswon(thisturn, boardarray, x, y) {
	// horizontal
	for (let i = 0; i < 4; i++) {
		if (boardarray[y][i] == thisturn && boardarray[y][i + 1] == thisturn && boardarray[y][i + 2] == thisturn && boardarray[y][i + 3] == thisturn) return true;
	}
	// vertical
	for (let i = 0; i < 3; i++) {
		if (boardarray[i][x] == thisturn && boardarray[i + 1][x] == thisturn && boardarray[i + 2][x] == thisturn && boardarray[i + 3][x] == thisturn) return true;
	}
	// descending diagonal
	for (let i = 0; i < 3; i++) {
		if (x < y) {
			if (x - x + i + 3 > 6 || y - x + i + 3 > 5) break;
		} else if (x - y + i + 3 > 6 || y - y + i + 3 > 5) {
			break;
		}
		if (boardarray[x < y ? y - x + i : y - y + i][x < y ? x - x + i : x - y + i] == thisturn && boardarray[x < y ? y - x + i + 1 : y - y + i + 1][x < y ? x - x + i + 1 : x - y + i + 1] == thisturn && boardarray[x < y ? y - x + i + 2 : y - y + i + 2][x < y ? x - x + i + 2 : x - y + i + 2] == thisturn && boardarray[x < y ? y - x + i + 3 : y - y + i + 3][x < y ? x - x + i + 3 : x - y + i + 3] == thisturn) return true;
	}
	// ascending diagonal
	for (let i = 0; i < 3; i++) {
		if (x > (5 - y)) {
			if (x - (5 - y) + i + 3 > 6 || y + (5 - y) - i - 3 < 0) break;
		} else if (x - x + i + 3 > 6 || y + x - i - 3 < 0) {
			break;
		}
		if (boardarray[x > (5 - y) ? y + (5 - y) - i : y + x - i][x > (5 - y) ? x - (5 - y) + i : x - x + i] == thisturn && boardarray[x > (5 - y) ? y + (5 - y) - i - 1 : y + x - i - 1][x > (5 - y) ? x - (5 - y) + i + 1 : x - x + i + 1] == thisturn && boardarray[x > (5 - y) ? y + (5 - y) - i - 2 : y + x - i - 2][x > (5 - y) ? x - (5 - y) + i + 2 : x - x + i + 2] == thisturn && boardarray[x > (5 - y) ? y + (5 - y) - i - 3 : y + x - i - 3][x > (5 - y) ? x - (5 - y) + i + 3 : x - x + i + 3] == thisturn) return true;
	}
	return false;
}