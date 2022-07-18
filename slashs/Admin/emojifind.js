const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

module.exports = {
	name: `emojifind`,
	description: `Find emojis online and add them directly in your server!`,
	userPerms: [`ManageEmojisAndStickers`],
	botPerms: [`ViewChannel`, `EmbedLinks`, `ManageEmojisAndStickers`],
	options: [
		{
			name: `name`,
			description: `Search new emoji by name`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `name`,
					description: `Emoji to search`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: `animated`,
					description: `Get only animated emojis`,
					type: Discord.ApplicationCommandOptionType.Boolean,
				},
			],
		},
		{
			name: `category`,
			description: `Search new emojis by category`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `category`,
					description: `Select a category`,
					type: Discord.ApplicationCommandOptionType.Integer,
					required: true,
					choices: [
						{ name: `ALL`, value: 0 },
						{ name: `Origianl Style`, value: 1 },
						{ name: `TV / Movie`, value: 2 },
						{ name: `Meme`, value: 3 },
						{ name: `Anime`, value: 4 },
						{ name: `Celebrity`, value: 5 },
						{ name: `Blobs`, value: 6 },
						{ name: `Thinking`, value: 7 },
						{ name: `Animated`, value: 8 },
						// {name:'NSFW', value:9}, // nope
						{ name: `Gaming`, value: 10 },
						{ name: `Letters`, value: 11 },
						{ name: `Other`, value: 12 },
						{ name: `Pepe`, value: 13 },
						{ name: `Logos`, value: 14 },
						// {name:'Cute', value:15}, // not working
						// {name:'Utility', value:16}, // not working
						// {name:'Animals', value:17}, // not working
						// {name:'Recolors', value:18}, // not working
						// {name:'Flags', value:19}, // not working
						// {name:'Hearts', value:20}, // not working
					],
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		interaction.deferReply();

		const emojis = await fetch(`https://emoji.gg/api/`).then(res => res.json());
		let matches;

		if (interaction.options.getSubcommand() === `name`) {
			const query = await interaction.options.getString(`name`).toLowerCase().trim().split(` `).join(`_`);
			matches = emojis.filter(s => s.title == query || s.title.includes(query));
			// animated filter
			if (interaction.options.getBoolean(`animated`)) matches = matches.filter(s => s.category == 8);
			// remove emojis bigger than 256KB
			matches = matches.filter(s => s.filesize < 256e3);
			// remove nsfw
			matches.filter(e => e.category == 9).forEach(f => matches.splice(matches.findIndex(e => e.title === f.title), 1));
		} else if (interaction.options.getInteger(`category`) === 0) {
			matches = emojis;
		} else {
			matches = emojis.filter(s => s.category === interaction.options.getInteger(`category`));
		}
		matches = matches.sort((a, b) => b.faves - a.faves);
		if (!matches.length) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_result(query))] });

		let page = 0;
		// eslint-disable-next-line no-shadow
		function embedUpdate(matches, page, success = false) {
			const embed = new Discord.EmbedBuilder()
				.setTitle(matches[page].title)
				.setURL(`https://discordemoji.com/emoji/` + matches[page].slug)
				.setColor(`Random`)
				.setThumbnail(matches[page].image)
				.addFields([
					{
						name: LANG.favourited_key,
						value: matches[page].faves !== 1 ? LANG.favourited_value_p(matches[page].faves) : LANG.favourited_value_s(matches[page].faves),
						inline: true,
					},
					{
						name: LANG.animated_key,
						value: matches[page].category == 8 ? LANG.yes : LANG.no,
						inline: true,
					},
				])
				.setFooter({ text: `${page + 1} / ${matches.length}` });
			if (success) embed.setAuthor({ name: LANG.created });
			return embed;
		}

		const prevButton = new Discord.ButtonBuilder()
			.setCustomId(`previous`)
			.setEmoji(`◀️`)
			.setStyle(Discord.ButtonStyle.Primary)
			.setDisabled(true);
		const nextButton = new Discord.ButtonBuilder()
			.setCustomId(`next`)
			.setEmoji(`▶️`)
			.setStyle(Discord.ButtonStyle.Primary);
		const addButton = new Discord.ButtonBuilder()
			.setCustomId(`add`)
			.setLabel(LANG.add)
			.setEmoji(`➕`)
			.setStyle(Discord.ButtonStyle.Success);

		if (matches.length == 1) nextButton.setDisabled(true);

		const row = new Discord.ActionRowBuilder().addComponents(prevButton, nextButton, addButton);

		interaction.followUp({ embeds: [embedUpdate(matches, page)], components: [row], fetchReply: true }).then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (i.user.id === interaction.user.id) return true;
				else return false;
			};
			const collector = sent.createMessageComponentCollector({ filter, componentType: Discord.ComponentType.Button, time: 60e3 });

			collector.on(`collect`, b => {
				addButton.setDisabled(false); // reset add button in case an emoji was added
				collector.resetTimer({ time: 60e3 });
				switch (b.customId) {
					case `previous`:
						if (page === 0) return;
						else page--;
						if (page > 0) prevButton.setDisabled(false);
						else prevButton.setDisabled(true);
						nextButton.setDisabled(false);
						sent.edit({ embeds: [embedUpdate(matches, page)], components: [row] });
						break;
					case `next`:
						if (page === matches.length - 1) return;
						else page++;
						if (page < matches.length - 1) nextButton.setDisabled(false);
						else nextButton.setDisabled(true);
						prevButton.setDisabled(false);
						sent.edit({ embeds: [embedUpdate(matches, page)], components: [row] });
						break;
					case `add`:
						const res = matches[page];
						try {
							interaction.guild.emojis.create({ attachment: res.image, name: res.title });
							addButton.setDisabled(true);
							sent.edit({ ephemeral: true, embeds: [embedUpdate(matches, page, true)], components: [row] });
						} catch (error) {
							sent.edit({ ephemeral: true, embeds: [client.chill.error(LANG.error)] });
							collector.stop();
						}
						break;
				}
			});
			collector.on(`end`, (collection, reason) => {
				if (reason == `time`) return sent.edit({ components: [] });
			});
		});
	},
};