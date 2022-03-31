const Discord = require(`discord.js`);

module.exports = {
	name: `slotmachine`,
	description: `Play a slot machine`,
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`],
	options: null,
	run: async (client, interaction, LANG) => {

		const spinButton = new Discord.MessageButton()
			.setCustomId(`spin`)
			.setLabel(LANG.reroll)
			.setStyle(`PRIMARY`);
		let row = new Discord.MessageActionRow().addComponents(spinButton);
		interaction.reply({ embeds: [slot(interaction)], components: [row] }).then(() => {
			interaction.fetchReply().then(sent => {
				const filter = (_interaction) => {
					_interaction.deferUpdate();
					if (_interaction.user.id === interaction.user.id) return true;
					return;
				};
				const collector = sent.createMessageComponentCollector({ filter, componentType: `BUTTON`, time: 60e3 });
				collector.on(`collect`, collected => {
					collector.resetTimer({ time: 60e3 });
					if (collected.customId == `spin`) return sent.edit({ embeds: [slot(interaction)] });
				});
				collector.on(`end`, (collected, reason) => {
					if (reason === `time`) return sent.edit({ components: [] });
					spinButton.setDisabled(true);
					row = new Discord.MessageActionRow().addComponents(spinButton);
					sent.edit({ components: [row] });
				});
			});
		});
	},
};

function slot(interaction) {
	const choices = [`🍇`, `🍒`, `🍋`, `🍊`];
	const slots = [];
	for (i = 1; i < 10; i++) {
		slots[i] = choices[Math.floor(Math.random() * choices.length)];
	}
	const slotEmbed = new Discord.MessageEmbed()
		.setTitle(`🎰 **Chill Slot** 🎰`)
		.setDescription(`${slots[1]}|${slots[2]}|${slots[3]}\n${slots[4]}|${slots[5]}|${slots[6]}\n${slots[7]}|${slots[8]}|${slots[9]}`);
	if ((slots[1] === slots[2] && slots[1] === slots[3] || slots[4] === slots[5] && slots[4] === slots[6] || slots[7] === slots[8] && slots[7] === slots[9]) ||
        (slots[1] === slots[4] && slots[1] === slots[7] || slots[2] === slots[5] && slots[2] === slots[8] || slots[3] === slots[6] && slots[3] === slots[9]) ||
        (slots[1] === slots[5] && slots[1] === slots[9] || slots[3] === slots[5] && slots[3] === slots[7])) {
		slotEmbed
			.setFooter({ text: LANG.won(interaction.member) })
			.setColor(`GREEN`);
	} else {
		slotEmbed
			.setFooter({ text: LANG.lost(interaction.member) })
			.setColor(`RED`);
	}
	return slotEmbed;
}
