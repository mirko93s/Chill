const Discord = require(`discord.js`);

module.exports = {
	name: `flood`,
	description: `Flood the board with a single color. You start in the top left corner with the white square`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`],
	options: [
		{
			name: `difficulty`,
			description: `Choose the difficulty. If omitted it will default to Impossible (what the game was designed for)`,
			type: Discord.ApplicationCommandOptionType.Integer,
			choices: [
				{ name: `Easy`, value: 7 },
				{ name: `Medium`, value: 9 },
				{ name: `Hard`, value: 11 },
				{ name: `Impossible (default)`, value: 13 },
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const difficulty = interaction.options.getInteger(`difficulty`) || 13;
		const _emojis = [`🟥`, `🟦`, `🟨`, `🟩`, `🟪`];
		const emojis = _emojis.splice(0, Math.floor(difficulty / 2) - 1);
		const boardarray = [];
		const button = [];
		const queue = [{ x: 0, y: 0 }];
		let turn = 0;
		let guessed = 1;
		let lastColor;
		// create buttons
		const row = new Discord.ActionRowBuilder();
		for (let i = 0; i < emojis.length; i++) {
			button[i] = new Discord.ButtonBuilder()
				.setCustomId(emojis[i])
				.setLabel(` `)
				.setStyle(Discord.ButtonStyle.Secondary)
				.setEmoji(emojis[i]);
			row.addComponents(button[i]);
		}
		// create game board
		for (let i = 0; i < difficulty; i++) {
			boardarray[i] = [];
			for (let j = 0; j < difficulty; j++) {
				boardarray[i][j] = emojis[Math.floor(Math.random() * emojis.length)];
			}
		}
		// set starting square
		boardarray[0][0] = `⬜`;
		const gameEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: `FLOOD` })
			.setDescription(boardToString(boardarray))
			.setFooter({ text: LANG.turns(turn) });
		return interaction.reply({ embeds: [gameEmbed], components: [row], fetchReply: true }).then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (i.user.id === interaction.user.id) return true;
				else return false;
			};
			const collector = sent.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60e3 });
			collector.on(`collect`, async c => {
				collector.resetTimer({ time: 60e3 });
				// first turn color filter
				if (queue.length === 1 && boardarray[0][1] !== c.customId && boardarray[1][0] !== c.customId) return;
				// if color is the same of the old turn return
				if (lastColor === c.customId) return;
				// check color
				await checkAdjacents(c, queue, boardarray, difficulty);
				// if there are any new squares update the board (valid color)
				if (queue.length > guessed) {
					guessed = queue.length;
					turn++;
					lastColor = c.customId;
					queue.forEach(q => {
						boardarray[q.x][q.y] = c.customId;
					});
					gameEmbed.setDescription(boardToString(boardarray)).setFooter({ text: `Turns: ${turn}` });
					sent.edit({ embeds: [gameEmbed], components: [row] });
				}
				// check if win
				if (queue.length === difficulty ** 2) {
					collector.stop(`won`);
				}
			});
			collector.on(`end`, (collected, reason) => {
				if (reason === `time`) gameEmbed.setTitle(LANG.inactivity);
				if (reason === `won`) gameEmbed.setTitle(LANG.WON);
				sent.edit({ embeds: [gameEmbed], components: [] });
			});
		});

	},
};

async function checkAdjacents(c, queue, boardarray, difficulty) {
	let i = 0;
	while (i < queue.length) {
		Up(queue[i].x, queue[i].y, c, queue, boardarray);
		Down(queue[i].x, queue[i].y, c, queue, boardarray, difficulty);
		Left(queue[i].x, queue[i].y, c, queue, boardarray);
		Right(queue[i].x, queue[i].y, c, queue, boardarray, difficulty);
		i++;
	}
}

async function Up(x, y, c, queue, boardarray) {
	if (queue.some(v => v.x === x - 1 && v.y === y)) return;
	while (x > 0) {
		if (boardarray[x - 1][y] === c.customId) {
			if (!queue.some(v => v.x === x - 1 && v.y === y)) queue.push({ x: (x - 1), y: (y) });
			x--;
		} else {
			break;
		}
	}
}

async function Down(x, y, c, queue, boardarray, difficulty) {
	if (queue.some(v => v.x === x + 1 && v.y === y)) return;
	while (x < difficulty - 1) {
		if (boardarray[x + 1][y] === c.customId) {
			if (!queue.some(v => v.x === x + 1 && v.y === y)) queue.push({ x: (x + 1), y: (y) });
			x++;
		} else {
			break;
		}
	}
}

async function Left(x, y, c, queue, boardarray) {
	if (queue.some(v => v.x === x && v.y === y - 1)) return;
	while (y > 0) {
		if (boardarray[x][y - 1] === c.customId) {
			if (!queue.some(v => v.x === x && v.y === y - 1)) queue.push({ x: (x), y: (y - 1) });
			y--;
		} else {
			break;
		}
	}
}

async function Right(x, y, c, queue, boardarray, difficulty) {
	if (queue.some(v => v.x === x && v.y === y + 1)) return;
	while (y < difficulty - 1) {
		if (boardarray[x][y + 1] === c.customId) {
			if (!queue.some(v => v.x === x && v.y === y + 1)) queue.push({ x: (x), y: (y + 1) });
			y++;
		} else {
			break;
		}
	}
}

function boardToString(board) { // convert board array to string
	let string = ``;
	for (let i = 0; i < board.length;i++) {
		string += `${board[i].join(``)}`;
		if (i != board.length) string += `\n`;
	}
	return string;
}