const Discord = require(`discord.js`);
const { Aki } = require(`aki-api`);
const isPlaying = new Set();

module.exports = {
	name: `akinator`,
	description: `Play Akinator`,
	botPerms: [`ViewChannel`, `EmbedLinks`],
	options: [
		{
			name: `language`,
			description: `Select a language. If omitted it defaults to english`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `English`, value: `en` },
				{ name: `English Objects`, value: `en_objects` },
				{ name: `English Animals`, value: `en_animals` },
				{ name: `Arabic`, value: `ar` },
				{ name: `Chinese`, value: `cn` },
				{ name: `German`, value: `de` },
				{ name: `German Animals`, value: `de_animals` },
				{ name: `Spanish`, value: `es` },
				{ name: `Spanish Animals`, value: `es_animals` },
				{ name: `French`, value: `fr` },
				{ name: `French Objects`, value: `fr_objects` },
				{ name: `French Animals`, value: `fr_animals` },
				{ name: `Hebrew`, value: `il` },
				{ name: `Italian`, value: `it` },
				{ name: `Italian Animals`, value: `it_animals` },
				{ name: `Japanese`, value: `jp` },
				{ name: `Japanese Animals`, value: `jp_animals` },
				{ name: `Korean`, value: `kr` },
				{ name: `Dutch`, value: `nl` },
				{ name: `Polish`, value: `pl` },
				{ name: `Portuguese`, value: `pt` },
				{ name: `Russian`, value: `ru` },
				{ name: `Turkish`, value: `tr` },
				{ name: `Indonesian`, value: `id` },
			],
		},
	],
	run: async (client, interaction, LANG) => {

		if (isPlaying.has(interaction.member.id)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_in_game)] });
		else isPlaying.add(interaction.member.id);

		interaction.deferReply();

		const b0 = new Discord.ButtonBuilder()
			.setCustomId(`0`)
			.setLabel(LANG.yes)
			.setStyle(Discord.ButtonStyle.Success)
			.setEmoji(`👍`);
		const b1 = new Discord.ButtonBuilder()
			.setCustomId(`1`)
			.setLabel(LANG.no)
			.setStyle(Discord.ButtonStyle.Danger)
			.setEmoji(`👎`);
		const b2 = new Discord.ButtonBuilder()
			.setCustomId(`2`)
			.setLabel(LANG.idk)
			.setStyle(Discord.ButtonStyle.Secondary)
			.setEmoji(`❓`);
		const b3 = new Discord.ButtonBuilder()
			.setCustomId(`3`)
			.setLabel(LANG.probably)
			.setStyle(Discord.ButtonStyle.Primary)
			.setEmoji(`🤔`);
		const b4 = new Discord.ButtonBuilder()
			.setCustomId(`4`)
			.setLabel(LANG.probably_not)
			.setStyle(Discord.ButtonStyle.Primary)
			.setEmoji(`🙄`);
		const row = new Discord.ActionRowBuilder().addComponents(b0, b1, b2, b3, b4);

		const yes = new Discord.ButtonBuilder()
			.setCustomId(`yes`)
			.setLabel(` `)
			.setStyle(Discord.ButtonStyle.Success)
			.setEmoji(`✅`);
		const no = new Discord.ButtonBuilder()
			.setCustomId(`no`)
			.setLabel(` `)
			.setStyle(Discord.ButtonStyle.Danger)
			.setEmoji(`❌`);
		const rowwin = new Discord.ActionRowBuilder().addComponents(yes, no);

		const region = interaction.options.getString(`language`) || `en`;
		const childMode = true;
		const proxy = undefined;
		let round = 0;
		let guess = false;
		const wrongGuess = [];
		let sinceLastGuess = false;
		let hasGuessed = false;

		const aki = new Aki({ region, childMode, proxy });
		await aki.start();

		const gameEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setAuthor({ name: `Akinator`, iconURL: `https://i.imgur.com/SGdaKmd.png` })
			.setDescription(aki.question)
			.addFields([
				{
					name: LANG.questions,
					value: round.toString(),
					inline: false,
				},
			])
			.setFooter({ text: LANG.progress(aki.progress.toFixed(2), (`▬`.repeat((Math.round(aki.progress / 5))) + `🔘` + `▬`.repeat(20 - (Math.round(aki.progress / 5))))) });

		interaction.followUp({ embeds: [gameEmbed], components: [row], fetchReply: true }).then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (i.user.id === interaction.user.id) return true;
				else return false;
			};
			const collector = sent.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60e3 });
			collector.on(`collect`, async c => {
				collector.resetTimer({ time: 60e3 });
				if (!guess) {
					await aki.step(c.customId);
					sinceLastGuess++;
					round++;
					gameEmbed.setDescription(aki.question).setFooter({ text: LANG.progress(aki.progress.toFixed(2), (`▬`.repeat((Math.round(aki.progress / 5))) + `🔘` + `▬`.repeat(20 - (Math.round(aki.progress / 5))))) });
					gameEmbed.fields[0].value = round.toString();
					if ((aki.progress >= 80 && (hasGuessed === false || sinceLastGuess >= 5)) || aki.currentStep >= 78) {
						hasGuessed = true;
						sinceLastGuess = 0;
						await aki.win();
						const guessed = aki.answers.filter(g => !wrongGuess.includes(g.id));
						if (guessed.length > 0) {
							guess = true;
							const guessEmbed = new Discord.EmbedBuilder()
								.setColor(`Random`)
								.setAuthor({ name: `Akinator`, iconURL: `https://i.imgur.com/SGdaKmd.png` })
								.setTitle(guessed[0].name)
								.setDescription(guessed[0].description)
								.setImage(guessed[0].absolute_picture_path)
								.setFooter({ text: LANG.guessed_footer(round) });
							await sent.edit({ embeds: [guessEmbed], components: [rowwin] });
						} else {
							await sent.edit({ embeds: [gameEmbed], components: [row] });
						}
					} else {
						await sent.edit({ embeds: [gameEmbed], components: [row] });
					}
				} else if (guess) {
					if (c.customId === `yes`) {
						collector.stop(`win`);
					} else {
						guess = false;
						wrongGuess.push(aki.answers.filter(g => !wrongGuess.includes(g.id))[0].id);
						if (aki.currentStep >= 78) {
							collector.stop(`defeated`);
							const defeatedEmbed = new Discord.EmbedBuilder()
								.setColor(`Random`)
								.setAuthor({ name: `Akinator`, iconURL: `https://i.imgur.com/SGdaKmd.png` })
								.setTitle(LANG.wp)
								.setDescription(LANG.defeated);
							return sent.edit({ embeds: [defeatedEmbed], components: [] });
						} else {
							sent.edit({ embeds: [gameEmbed], components: [row] });
						}
					}
				}
			});
			collector.on(`end`, (collected, reason) => {
				isPlaying.delete(interaction.member.id);
				if (reason === `time`) gameEmbed.setTitle(LANG.inactivity);
				else if (reason === `win`) sent.edit({ components: [] });
			});
		});
	},
};