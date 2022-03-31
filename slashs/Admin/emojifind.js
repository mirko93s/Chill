const Discord = require(`discord.js`);
const fetch = require(`node-fetch`);

module.exports = {
	name: `emojifind`,
	description: `Find emojis online and add them directly in your server!`,
	userPerms: [`MANAGE_EMOJIS_AND_STICKERS`],
	botPerms: [`VIEW_CHANNEL`, `EMBED_LINKS`, `MANAGE_EMOJIS_AND_STICKERS`],
	options: [
		{
			name: `name`,
			description: `Search new emoji by name`,
			type: `SUB_COMMAND`,
			options: [
				{
					name: `name`,
					description: `Emoji to search`,
					type: `STRING`,
					required: true,
				},
				{
					name: `animated`,
					description: `Get only animated emojis`,
					type: `BOOLEAN`,
				},
			],
		},
		{
			name: `category`,
			description: `Search new emojis by category`,
			type: `SUB_COMMAND`,
			options: [
				{
					name: `category`,
					description: `Select a category`,
					type: `INTEGER`,
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
			const embed = new Discord.MessageEmbed()
				.setTitle(matches[page].title)
				.setURL(`https://discordemoji.com/emoji/` + matches[page].slug)
				.setColor(`RANDOM`)
				.setThumbnail(matches[page].image)
				.addField(LANG.favourited_key, LANG.favourited_value(matches[page].faves), true)
				.addField(LANG.animated_key, LANG.animated_value(matches[page].category), true)
				.setFooter({ text: `${page + 1} / ${matches.length}` });
			if (success) embed.setAuthor({ name: LANG.created });
			return embed;
		}

		const prevButton = new Discord.MessageButton()
			.setCustomId(`previous`)
			.setEmoji(`◀️`)
			.setStyle(`PRIMARY`)
			.setDisabled(true);
		const nextButton = new Discord.MessageButton()
			.setCustomId(`next`)
			.setEmoji(`▶️`)
			.setStyle(`PRIMARY`);
		const addButton = new Discord.MessageButton()
			.setCustomId(`add`)
			.setLabel(LANG.add)
			.setEmoji(`➕`)
			.setStyle(`SUCCESS`);

		if (matches.length == 1) nextButton.setDisabled(true);

		const row = new Discord.MessageActionRow().addComponents(prevButton, nextButton, addButton);

		interaction.followUp({ embeds: [embedUpdate(matches, page)], components: [row], fetchReply: true }).then(sent => {
			const filter = (i) => {
				i.deferUpdate();
				if (i.user.id === interaction.user.id) return true;
				else return false;
			};
			const collector = sent.createMessageComponentCollector({ filter, componentType: `BUTTON`, time: 60e3 });

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
							interaction.guild.emojis.create(res.image, res.title);
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