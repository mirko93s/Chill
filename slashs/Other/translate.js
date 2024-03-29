const Discord = require(`discord.js`);
const translate = require(`@vitalets/google-translate-api`);

module.exports = {
	name: `translate`,
	description: `Translate something. (Also available right-clicking a message, only to english)`,
	options: [
		{
			name: `text`,
			description: `text to translate`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 1024,
			required: true,
		},
		{
			name: `languages__a-e`,
			description: `Languages from A to E. Choose only one target language! If omitted defaults to English`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `Automatic`, value: `auto` },
				{ name: `Afrikaans`, value: `af` },
				{ name: `Albanian`, value: `sq` },
				{ name: `Amharic`, value: `am` },
				{ name: `Arabic`, value: `ar` },
				{ name: `Armenian`, value: `hy` },
				{ name: `Azerbaijani`, value: `az` },
				{ name: `Basque`, value: `eu` },
				{ name: `Belarusian`, value: `be` },
				{ name: `Bengali`, value: `bn` },
				{ name: `Bosnian`, value: `bs` },
				{ name: `Bulgarian`, value: `bg` },
				{ name: `Catalan`, value: `ca` },
				{ name: `Cebuano`, value: `ceb` },
				{ name: `Chichewa`, value: `ny` },
				{ name: `Chinese (Simplified)`, value: `zh-CN` },
				{ name: `Chinese (Traditional)`, value: `zh-TW` },
				{ name: `Corsican`, value: `co` },
				{ name: `Croatian`, value: `hr` },
				{ name: `Czech`, value: `cs` },
				{ name: `Danish`, value: `da` },
				{ name: `Dutch`, value: `nl` },
				{ name: `English`, value: `en` },
				{ name: `Esperanto`, value: `eo` },
				{ name: `Estonian`, value: `et` },
			],
		},
		{
			name: `languages__f-j`,
			description: `Languages from F to J. Choose only one target language! If omitted defaults to English`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `Filipino`, value: `tl` },
				{ name: `Finnish`, value: `fi` },
				{ name: `French`, value: `fr` },
				{ name: `Frisian`, value: `fy` },
				{ name: `Galician`, value: `gl` },
				{ name: `Georgian`, value: `ka` },
				{ name: `German`, value: `de` },
				{ name: `Greek`, value: `el` },
				{ name: `Gujarati`, value: `gu` },
				{ name: `Haitian Creole`, value: `ht` },
				{ name: `Hausa`, value: `ha` },
				{ name: `Hawaiian`, value: `haw` },
				{ name: `Hebrew`, value: `iw` },
				{ name: `Hindi`, value: `hi` },
				{ name: `Hmong`, value: `hmn` },
				{ name: `Hungarian`, value: `hu` },
				{ name: `Icelandic`, value: `is` },
				{ name: `Igbo`, value: `ig` },
				{ name: `Indonesian`, value: `id` },
				{ name: `Irish`, value: `ga` },
				{ name: `Italian`, value: `it` },
				{ name: `Japanese`, value: `ja` },
				{ name: `Javanese`, value: `jw` },
			],
		},
		{
			name: `languages__k-n`,
			description: `Languages from K to N. Choose only one target language! If omitted defaults to English`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `Kannada`, value: `kn` },
				{ name: `Kazakh`, value: `kk` },
				{ name: `Khmer`, value: `km` },
				{ name: `Korean`, value: `ko` },
				{ name: `Kurdish (Kurmanji)`, value: `ku` },
				{ name: `Kyrgyz`, value: `ky` },
				{ name: `Lao`, value: `lo` },
				{ name: `Latin`, value: `la` },
				{ name: `Latvian`, value: `lv` },
				{ name: `Lithuanian`, value: `lt` },
				{ name: `Luxembourgish`, value: `lb` },
				{ name: `Macedonian`, value: `mk` },
				{ name: `Malagasy`, value: `mg` },
				{ name: `Malay`, value: `ms` },
				{ name: `Malayalam`, value: `ml` },
				{ name: `Maltese`, value: `mt` },
				{ name: `Maori`, value: `mi` },
				{ name: `Marathi`, value: `mr` },
				{ name: `Mongolian`, value: `mn` },
				{ name: `Myanmar (Burmese)`, value: `my` },
				{ name: `Nepali`, value: `ne` },
				{ name: `Norwegian`, value: `no` },
			],
		},
		{
			name: `languages__p-s`,
			description: `Languages from P to S. Choose only one target language! If omitted defaults to English`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `Pashto`, value: `ps` },
				{ name: `Persian`, value: `fa` },
				{ name: `Polish`, value: `pl` },
				{ name: `Portuguese`, value: `pt` },
				{ name: `Punjabi`, value: `pa` },
				{ name: `Romanian`, value: `ro` },
				{ name: `Russian`, value: `ru` },
				{ name: `Samoan`, value: `sm` },
				{ name: `Scots Gaelic`, value: `gd` },
				{ name: `Serbian`, value: `sr` },
				{ name: `Sesotho`, value: `st` },
				{ name: `Shona`, value: `sn` },
				{ name: `Sindhi`, value: `sd` },
				{ name: `Sinhala`, value: `si` },
				{ name: `Slovak`, value: `sk` },
				{ name: `Slovenian`, value: `sl` },
				{ name: `Somali`, value: `so` },
				{ name: `Spanish`, value: `es` },
				{ name: `Sundanese`, value: `su` },
				{ name: `Swahili`, value: `sw` },
				{ name: `Swedish`, value: `sv` },
			],
		},
		{
			name: `languages__t-z`,
			description: `Languages from T to Z. Choose only one target language! If omitted defaults to English`,
			type: Discord.ApplicationCommandOptionType.String,
			choices: [
				{ name: `Tajik`, value: `tg` },
				{ name: `Tamil`, value: `ta` },
				{ name: `Telugu`, value: `te` },
				{ name: `Thai`, value: `th` },
				{ name: `Turkish`, value: `tr` },
				{ name: `Ukrainian`, value: `uk` },
				{ name: `Urdu`, value: `ur` },
				{ name: `Uzbek`, value: `uz` },
				{ name: `Vietnamese`, value: `vi` },
				{ name: `Welsh`, value: `cy` },
				{ name: `Xhosa`, value: `xh` },
				{ name: `Yiddish`, value: `yi` },
				{ name: `Yoruba`, value: `yo` },
				{ name: `Zulu`, value: `zu` },
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const text = interaction.options.getString(`text`);

		const lang = interaction.options.getString(`languages__a-e`) || interaction.options.getString(`languages__f-j`) || interaction.options.getString(`languages__k-n`) || interaction.options.getString(`languages__p-s`) || interaction.options.getString(`languages__t-z`) || `en`;

		translate(text, { to: lang }).then(res => {
			const translatedEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(LANG.title)
				.setDescription(res.text)
				.setFooter({ text: `${_lang[res.from.language.iso]} ➜ ${_lang[lang]}` });
			interaction.reply({ embeds: [translatedEmbed] });
		}).catch(err => {
			if (err) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(err))] });
		});
	},
};

module.exports.message = {
	name: `Translate to EN`,
	type: Discord.ApplicationCommandType.Message,
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`, `ReadMessageHistory`],
	contextdescription: `Translate a message to English`,
	run: async (client, interaction, LANG) => {

		interaction.deferReply();

		if (!interaction.targetMessage.content) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.message_invalid)] });

		translate(interaction.targetMessage.content, { to: `en` }).then(res => {
			const translatedEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setAuthor({ name: LANG.context_to_en })
				.setDescription(res.text)
				.setFooter({ text: LANG.footer(interaction.user.tag) });
			interaction.targetMessage.reply({ embeds: [translatedEmbed] });
			interaction.deleteReply();
		}).catch(err => {
			console.error(err);
		});
	},
};

const _lang = {
	'auto': `Automatic`,
	'af': `Afrikaans`,
	'sq': `Albanian`,
	'am': `Amharic`,
	'ar': `Arabic`,
	'hy': `Armenian`,
	'az': `Azerbaijani`,
	'eu': `Basque`,
	'be': `Belarusian`,
	'bn': `Bengali`,
	'bs': `Bosnian`,
	'bg': `Bulgarian`,
	'ca': `Catalan`,
	'ceb': `Cebuano`,
	'ny': `Chichewa`,
	'zh-CN': `Chinese (Simplified)`,
	'zh-TW': `Chinese (Traditional)`,
	'co': `Corsican`,
	'hr': `Croatian`,
	'cs': `Czech`,
	'da': `Danish`,
	'nl': `Dutch`,
	'en': `English`,
	'eo': `Esperanto`,
	'et': `Estonian`,
	'tl': `Filipino`,
	'fi': `Finnish`,
	'fr': `French`,
	'fy': `Frisian`,
	'gl': `Galician`,
	'ka': `Georgian`,
	'de': `German`,
	'el': `Greek`,
	'gu': `Gujarati`,
	'ht': `Haitian Creole`,
	'ha': `Hausa`,
	'haw': `Hawaiian`,
	'he': `Hebrew`,
	'iw': `Hebrew`,
	'hi': `Hindi`,
	'hmn': `Hmong`,
	'hu': `Hungarian`,
	'is': `Icelandic`,
	'ig': `Igbo`,
	'id': `Indonesian`,
	'ga': `Irish`,
	'it': `Italian`,
	'ja': `Japanese`,
	'jw': `Javanese`,
	'kn': `Kannada`,
	'kk': `Kazakh`,
	'km': `Khmer`,
	'ko': `Korean`,
	'ku': `Kurdish (Kurmanji)`,
	'ky': `Kyrgyz`,
	'lo': `Lao`,
	'la': `Latin`,
	'lv': `Latvian`,
	'lt': `Lithuanian`,
	'lb': `Luxembourgish`,
	'mk': `Macedonian`,
	'mg': `Malagasy`,
	'ms': `Malay`,
	'ml': `Malayalam`,
	'mt': `Maltese`,
	'mi': `Maori`,
	'mr': `Marathi`,
	'mn': `Mongolian`,
	'my': `Myanmar (Burmese)`,
	'ne': `Nepali`,
	'no': `Norwegian`,
	'ps': `Pashto`,
	'fa': `Persian`,
	'pl': `Polish`,
	'pt': `Portuguese`,
	'pa': `Punjabi`,
	'ro': `Romanian`,
	'ru': `Russian`,
	'sm': `Samoan`,
	'gd': `Scots Gaelic`,
	'sr': `Serbian`,
	'st': `Sesotho`,
	'sn': `Shona`,
	'sd': `Sindhi`,
	'si': `Sinhala`,
	'sk': `Slovak`,
	'sl': `Slovenian`,
	'so': `Somali`,
	'es': `Spanish`,
	'su': `Sundanese`,
	'sw': `Swahili`,
	'sv': `Swedish`,
	'tg': `Tajik`,
	'ta': `Tamil`,
	'te': `Telugu`,
	'th': `Thai`,
	'tr': `Turkish`,
	'uk': `Ukrainian`,
	'ur': `Urdu`,
	'uz': `Uzbek`,
	'vi': `Vietnamese`,
	'cy': `Welsh`,
	'xh': `Xhosa`,
	'yi': `Yiddish`,
	'yo': `Yoruba`,
	'zu': `Zulu`,
};