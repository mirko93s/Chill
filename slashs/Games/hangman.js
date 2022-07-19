const Discord = require(`discord.js`);

module.exports = {
	name: `hangman`,
	description: `Play the classic hangman`,
	botPerms: [`ViewChannel`, `EmbedLinks`],
	options: [
		{
			name: `word`,
			description: `Word to guess`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 100,
			required: true,
		},
		{
			name: `player`,
			description: `User to play against. If omitted (or if you choose yourself) everyone can play.`,
			type: Discord.ApplicationCommandOptionType.User,
		},
	],
	run: async (client, interaction, LANG) => {

		const word = interaction.options.getString(`word`).toUpperCase().replace(/[^a-zA-Z\s]/g, ``).replace(/[\s]{2,}/g, ` `);
		const guess = word.replace(/[a-zA-Z]/g, `⍰`).split(``);
		const player = interaction.options.getMember(`player`)?.id === interaction.member.id ? null : interaction.options.getMember(`player`);
		const alphabet = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`];
		const button = [];
		const row = [];
		let lives = 6;
		let isMainPage = true;
		let lastGuesser;
		// create buttons with letters
		for (let i = 0; i < alphabet.length; i++) {
			button[i] = new Discord.ButtonBuilder()
				.setCustomId(i.toString())
				.setLabel(alphabet[i])
				.setStyle(Discord.ButtonStyle.Primary);
		};
		// create rows with letter buttons
		for (let i = 0; i < alphabet.length; i += 5) {
			if (i < 25) row[i / 5] = new Discord.ActionRowBuilder().addComponents(button[i], button[i + 1], button[i + 2], button[i + 3], button[i + 4]);
			else row[i / 5] = new Discord.ActionRowBuilder().addComponents(button[i]);
		}
		// create "footer" buttons
		leftButton = new Discord.ButtonBuilder()
			.setCustomId(`left`)
			.setLabel(` `)
			.setEmoji(`⬅️`)
			.setStyle(Discord.ButtonStyle.Secondary);
		rightButton = new Discord.ButtonBuilder()
			.setCustomId(`right`)
			.setLabel(` `)
			.setEmoji(`➡️`)
			.setStyle(Discord.ButtonStyle.Secondary);
		livesButton = new Discord.ButtonBuilder()
			.setCustomId(`lives`)
			.setLabel(lives.toString())
			.setEmoji(`❤️`)
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(true);
		disabledButton1 = new Discord.ButtonBuilder()
			.setCustomId(`d1`)
			.setLabel(` `)
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(true);
		disabledButton2 = new Discord.ButtonBuilder()
			.setCustomId(`d2`)
			.setLabel(` `)
			.setStyle(Discord.ButtonStyle.Secondary)
			.setDisabled(true);

		const footerRow = new Discord.ActionRowBuilder().addComponents(leftButton, disabledButton1, livesButton, disabledButton2, rightButton);
		// menu pages
		const menu1 = [row[0], row[1], row[2], footerRow];
		const menu2 = [row[3], row[4], row[5], footerRow];
		// hangman text
		const ascii = [
			`┏━━━━┓\n┃    ┃\n┃\n┃\n┃\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   😁\n┃\n┃\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   😀\n┃    |\n┃\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   🙂\n┃   /|\n┃\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   🙁\n┃   /|\\\n┃\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   😨\n┃   /|\\\n┃   /\n┃\n┗━━━━━━━━┛`,
			`┏━━━━┓\n┃    ┃\n┃   😵\n┃   /|\\\n┃   / \\\n┃\n┗━━━━━━━━┛`,
		];

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: LANG.hangman })
			.setTitle(guess.join(``))
			.setDescription(`\`\`\`${ascii[7 - (lives + 1)]}\`\`\``);
		if (player) {
			embed.addFields([
				{
					name: LANG.player,
					value: `${player}`,
					inline: false,
				},
			]);
		}

		interaction.reply({ embeds: [embed], components: menu1 });
		interaction.fetchReply().then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (player && i.user.id === player.id) return true;
				else if (!player && i.user.id !== interaction.member.id) return true;
				else return false;
			};
			const collector = sent.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60e3 });
			collector.on(`collect`, c => {
				collector.resetTimer({ time: 60e3 });
				lastGuesser = c.member;
				// switch page
				if (c.customId === `left` || c.customId === `right`) {
					sent.edit({ components: isMainPage ? menu2 : menu1 });
					isMainPage = !isMainPage;
				} else {
					let isCorrect = false;
					// check letter
					for (let i = 0; i < word.length; i++) {
						// right letter
						if (word[i] === button[c.customId].label) {
							guess[i] = button[c.customId].label;
							isCorrect = true;
						}
					}
					embed.setTitle(guess.join(``));
					button[c.customId].setDisabled(true);
					// wrong letter
					if (!isCorrect) {
						lives--;
						livesButton.setLabel(lives.toString());
						embed.setDescription(`\`\`\`${ascii[7 - (lives + 1)]}\`\`\``);
						// out of lives
						if (lives === 0) {
							collector.stop(`lost`);
						}
					}
					if (lives > 0) sent.edit({ embeds: [embed], components: isMainPage ? menu1 : menu2 });
					// check won
					if (!guess.includes(`⍰`)) return collector.stop(`won`);
				}
			});
			collector.on(`end`, (collected, reason) => {
				if (reason === `time`) embed.setTitle(LANG.inactivity);
				if (reason === `won`) embed.setDescription(embed.description + LANG.won(player || lastGuesser));
				if (reason === `lost`) embed.setDescription(embed.description + LANG.lost(player || lastGuesser, word));
				if (player && reason !== `time`) embed.fields = [];
				sent.edit({ embeds: [embed], components: [] });
			});
		});
	},
};