const Discord = require(`discord.js`);

module.exports = {
	name: `match`,
	description: `Match the couples to win!`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`],
	options: null,
	run: async (client, interaction, LANG) => {

		let emojis = [`🍇`, `🍈`, `🍉`, `🍊`, `🍋`, `🍌`, `🍍`, `🥭`, `🍎`, `🍏`, `🍐`, `🍑`, `🍒`, `🍓`, `🫐`, `🥝`, `🍅`, `🫒`, `🥥`, `🥑`, `🍆`, `🥔`, `🥕`, `🌽`, `🌶`, `🫑`, `🥒`, `🥬`, `🥦`, `🧄`, `🧅`, `🍄`, `🥜`, `🌰`, `🍞`, `🥐`, `🥖`, `🫓`, `🥨`, `🥯`, `🥞`, `🧇`, `🧀`, `🍖`, `🍗`, `🥩`, `🥓`, `🍔`, `🍟`, `🍕`, `🌭`, `🥪`, `🌮`, `🌯`, `🫔`, `🥙`, `🧆`, `🥚`, `🍳`, `🥘`, `🍲`, `🫕`, `🥣`, `🥗`, `🍿`, `🧈`, `🧂`, `🥫`, `🍱`, `🍘`, `🍙`, `🍚`, `🍛`, `🍜`, `🍝`, `🍠`, `🍢`, `🍣`, `🍤`, `🍥`, `🥮`, `🍡`, `🥟`, `🥠`, `🥡`, `🦪`, `🍦`, `🍧`, `🍨`, `🍩`, `🍪`, `🎂`, `🍰`, `🧁`, `🥧`, `🍫`, `🍬`, `🍭`, `🍮`, `🍯`, `🍼`, `🥛`, `☕`, `🫖`, `🍵`, `🍶`, `🍾`, `🍷`, `🍸`, `🍹`, `🍺`, `🍻`, `🥂`, `🥃`, `🥤`, `🧋`, `🧃`, `🧉`, `🧊`, `🥢`, `🍽`, `🍴`, `🥄`];
		const button = [];
		const row = [];
		// emojis
		for (let i = emojis.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = emojis[i];
			emojis[i] = emojis[j];
			emojis[j] = temp;
		}
		emojis.splice(12);
		emojis = emojis.concat(emojis);
		for (let i = emojis.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const temp = emojis[i];
			emojis[i] = emojis[j];
			emojis[j] = temp;
		}
		// random number generator
		const num = [];
		while (num.length < 24) {
			const r = Math.floor(Math.random() * 24);
			if (num.indexOf(r) === -1) num.push(r);
		}
		// buttons
		for (let i = 0; i < 24; i++) {
			button[num[i]] = new Discord.MessageButton()
				.setCustomId(num[i].toString())
				.setLabel(` `)
				.setStyle(`SECONDARY`);
			button[num[i]]._emoji = emojis[num[i]];
		}
		// last button
		let remaining = 12;
		const lastButton = new Discord.MessageButton()
			.setCustomId(`24`)
			.setLabel(`12`)
			.setStyle(`SECONDARY`)
			.setDisabled(true);
		button[24] = lastButton;
		// create rows
		for (let i = 0; i < 25; i += 5) {
			row[i / 5] = new Discord.MessageActionRow().addComponents(button[i], button[i + 1], button[i + 2], button[i + 3], button[i + 4]);
		}

		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title);

		interaction.reply({ embeds: [embed], components: [row[0], row[1], row[2], row[3], row[4]] });
		interaction.fetchReply().then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (i.user.id === interaction.member.id) return true;
				else return false;
			};
			let already = false;
			let previousId = ``;
			let previousEmoji = ``;
			const collector = sent.createMessageComponentCollector({ filter, componentType: `BUTTON`, time: 60e3 });
			collector.on(`collect`, c => {
				if (c.customId === previousId) return;
				else collector.resetTimer({ time: 60e3 });
				if (!already) {
					previousId = c.customId;
					previousEmoji = button[c.customId]._emoji;
					button[c.customId].setDisabled(false).setStyle(`PRIMARY`).setEmoji(button[c.customId]._emoji);
					sent.edit({ components: [row[0], row[1], row[2], row[3], row[4]] });
					already = !already;
				} else if (previousEmoji === button[c.customId]._emoji) { // if correct
					remaining--;
					if (remaining === 0) {
						collector.stop();
						lastButton.setLabel(`WON`).setStyle(`SUCCESS`);
					} else {
						lastButton.setLabel(remaining.toString());
					}
					button[c.customId].setDisabled(true).setStyle(`SUCCESS`).setEmoji(button[c.customId]._emoji);
					button[previousId].setDisabled(true).setStyle(`SUCCESS`);
					sent.edit({ components: [row[0], row[1], row[2], row[3], row[4]] });
					already = !already;
				} else { // if wrong
					button[c.customId].setDisabled(false).setStyle(`DANGER`).setEmoji(button[c.customId]._emoji);
					button[previousId].setStyle(`DANGER`);
					sent.edit({ components: [row[0], row[1], row[2], row[3], row[4]] });
					already = !already;
					button[c.customId].setDisabled(false).setStyle(`SECONDARY`).setEmoji();
					button[previousId].setDisabled(false).setStyle(`SECONDARY`).setEmoji();
				}
			});
			collector.on(`end`, (collected, reason) => {
				if (reason === `time`) {
					for (let i = 0; i < 25; i++) { // disable all buttons
						button[i].setDisabled(true);
					};
					embed.setDescription(LANG.inactivity);
				} else {
					embed.setDescription(LANG.won(interaction.member));
				};
				sent.edit({ embeds: [embed], components: [row[0], row[1], row[2], row[3], row[4]] });
			});
		});
	},
};