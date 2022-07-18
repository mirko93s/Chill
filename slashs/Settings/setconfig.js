const Discord = require(`discord.js`);

module.exports = {
	name: `setconfig`,
	description: `Change a config's value`,
	userPerms: [`ADMINISTRATOR`],
	botPerms: [`MANAGE_GUILD`],
	options: [
		{
			name: `text`,
			description: `Change bot's text channels`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `channel`,
					description: `Select a channel`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Welcome (join/leave log)`, value: `welcomechannel` },
						{ name: `Announcements`, value: `bcchannel` },
						{ name: `Punishments (ban, kick, etc... log)`, value: `puchannel` },
						{ name: `Reports (User and Message reports)`, value: `reportchannel` },
						{ name: `Giveaway`, value: `gachannel` },
						{ name: `Poll`, value: `pollchannel` },
						{ name: `Song-Request`, value: `musictextchannel` },
					],
				},
				{
					name: `newchannel`,
					description: `Set new channel`,
					type: Discord.ApplicationCommandOptionType.Channel,
					channelTypes: [Discord.ChannelType.GuildText, Discord.ChannelType.GuildNews],
					required: true,
				},
			],
		},
		{
			name: `voice`,
			description: `Change bot's voice channels`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `channel`,
					description: `Select a channel`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Music`, value: `musicvocalchannel` },
					],
				},
				{
					name: `newchannel`,
					description: `Set new channel`,
					type: Discord.ApplicationCommandOptionType.Channel,
					channelTypes: [Discord.ChannelType.GuildVoice],
					required: true,
				},
			],
		},
		{
			name: `category`,
			description: `Change bot's category channels`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `channel`,
					description: `Select a channel`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Tickets`, value: `ticketcategory` },
					],
				},
				{
					name: `newchannel`,
					description: `Set new channel`,
					type: Discord.ApplicationCommandOptionType.Channel,
					channelTypes: [Discord.ChannelType.GuildCategory],
					required: true,
				},
			],
		},
		{
			name: `roles`,
			description: `Change bot's roles`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `role`,
					description: `Select a role`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Music temp`, value: `musictemprole` },
						{ name: `DJ`, value: `djrole` },
						{ name: `Staff`, value: `supportrole` },
						{ name: `Welcome (given on-join)`, value: `roleonjoin` },
					],
				},
				{
					name: `newrole`,
					description: `Set new role`,
					type: Discord.ApplicationCommandOptionType.Role,
					required: true,
				},
			],
		},
		{
			name: `toggles`,
			description: `Change bot's toggles`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `toggle`,
					description: `Select a toggle`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Limit music commands to Song-Request channel`, value: `musicchannelonly` },
						{ name: `Auto delete user commands`, value: `autodeletecmds` },
						{ name: `XP Leveling System`, value: `xpmodule` },
						{ name: `Join/Leave Messages`, value: `welcomemessage` },
						{ name: `Welcome Role`, value: `welcomerole` },
						{ name: `DJ role required to play Music`, value: `djrequired` },
					],
				},
				{
					name: `enabled`,
					description: `Enable/Disable`,
					type: Discord.ApplicationCommandOptionType.Boolean,
					required: true,
				},
			],
		},
		{
			name: `xp_cooldown`,
			description: `Change xp cooldown`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `newvalue`,
					description: `Set new value`,
					type: Discord.ApplicationCommandOptionType.Integer,
					required: true,
					minValue: 1,
					maxValue: 60,
				},
			],
		},
		{
			name: `language`,
			description: `Change server's language. Help me translate, join the crowdin project at >>> translate.chill.ovh <<<`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `languages`,
					description: `Choose one language (if a string has not been translated yet it fallbacks to english)`,
					type: Discord.ApplicationCommandOptionType.String,
					choices: [
						{ name: `Dansk`, value: `da` },
						{ name: `Deutsch`, value: `de` },
						{ name: `English`, value: `en-US` },
						{ name: `Español`, value: `es-ES` },
						{ name: `Français`, value: `fr` },
						{ name: `Hrvatski`, value: `hr` },
						{ name: `Italiano`, value: `it` },
						{ name: `Lietuviškai`, value: `lt` },
						{ name: `Magyar`, value: `hu` },
						{ name: `Nederlands`, value: `nl` },
						{ name: `Norsk`, value: `no` },
						{ name: `Polski`, value: `pl` },
						{ name: `Português do Brasil`, value: `pt-BR` },
						{ name: `Română`, value: `ro` },
						{ name: `Suomi`, value: `fi` },
					],
				},
				{
					name: `languages_more`,
					description: `Choose one language (if a string has not been translated yet it fallbacks to english)`,
					type: Discord.ApplicationCommandOptionType.String,
					choices: [
						{ name: `Svenska`, value: `sv-SE` },
						{ name: `Tiếng Việt`, value: `vi` },
						{ name: `Türkçe`, value: `tr` },
						{ name: `Čeština`, value: `cs` },
						{ name: `Ελληνικά`, value: `el` },
						{ name: `български`, value: `bg` },
						{ name: `Pусский`, value: `ru` },
						{ name: `Українська`, value: `uk` },
						{ name: `हिन्दी`, value: `hi` },
						{ name: `ไทย`, value: `th` },
						{ name: `中文`, value: `zh-CN` },
						{ name: `日本語`, value: `ja` },
						{ name: `繁體中文`, value: `zh-TW` },
						{ name: `한국어`, value: `ko` },
					],
				},
			],
		},
		{
			name: `prefix`,
			description: `Change bot's prefix used for custom commands`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `newvalue`,
					description: `Set new value`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
	],
	run: (client, interaction, LANG) => {

		let config_key, value, flag;

		const locales = { da: { flag: `🇩🇰`, text: `Dansk` }, de: { flag: `🇩🇪`, text: `Deutsch` }, 'en-US': { flag: `🇺🇸`, text: `English` }, 'es-ES': { flag: `🇪🇸`, text: `Español` }, fr: { flag: `🇫🇷`, text: `Français` }, hr: { flag: `🇭🇷`, text: `Hrvatski` }, it: { flag: `🇮🇹`, text: `Italiano` }, lt: { flag: `🇱🇹`, text: `Lietuviškai` }, hu: { flag: `🇭🇺`, text: `Magyar` }, nl: { flag: `🇳🇱`, text: `Nederlands` }, no: { flag: `🇳🇴`, text: `Norsk` }, pl: { flag: `🇵🇱`, text: `Polski` }, 'pt-BR': { flag: `🇧🇷`, text: `Português do Brasil` }, ro: { flag: `🇷🇴`, text: `Română` }, fi: { flag: `🇫🇮`, text: `Suomi` }, 'sv-SE': { flag: `🇸🇪`, text: `Svenska` }, vi: { flag: `🇻🇳`, text: `Tiếng Việt` }, tr: { flag: `🇹🇷`, text: `Türkçe` }, cs: { flag: `🇨🇿`, text: `Čeština` }, el: { flag: `🇬🇷`, text: `Ελληνικά` }, bg: { flag: `🇧🇬`, text: `български` }, ru: { flag: `🇷🇺`, text: `Pусский` }, uk: { flag: `🇺🇦`, text: `Українська` }, hi: { flag: `🇮🇳`, text: `हिन्दी` }, th: { flag: `🇹🇭`, text: `ไทย` }, 'zh-CN': { flag: `🇨🇳`, text: `中文` }, ja: { flag: `🇯🇵`, text: `日本語` }, 'zh-TW': { flag: `🇹🇼`, text: `繁體中文` }, ko: { flag: `🇰🇷`, text: `한국어` } };

		switch (interaction.options.getSubcommand()) {
			case `text`:
			case `voice`:
			case `category`:
				config_key = interaction.options.getString(`channel`);
				value = interaction.options.getChannel(`newchannel`).id;
				break;
			case `roles`:
				config_key = interaction.options.getString(`role`);
				value = interaction.options.getRole(`newrole`).id;
				break;
			case `toggles`:
				config_key = interaction.options.getString(`toggle`);
				value = interaction.options.getBoolean(`enabled`);
				break;
			case `prefix`:
				config_key = `prefix`;
				value = interaction.options.getString(`newvalue`).substring(0, 10);
				break;
			case `numbers`:
				config_key = `xpcooldown`;
				value = interaction.options.getInteger(`newvalue`);
				break;
			case `language`:
				config_key = `language`;
				value = interaction.options.getString(`languages`) || interaction.options.getString(`languages_more`) || `en-US`;
				break;
		}

		if (interaction.options.getSubcommand() === `language`) {
			interaction.guild.setPreferredLocale(value);
			flag = locales[value].flag;
			value = locales[value].text;
		} else if (!client.settings.has(interaction.guild.id, config_key)) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.invalid_key)] });
		} else {
			client.settings.set(interaction.guild.id, value, config_key);
		}

		const changedEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(LANG.title)
			.setDescription(LANG.success(config_key, flag || ``, value));
		interaction.reply({ embeds: [changedEmbed] });
	},
};
