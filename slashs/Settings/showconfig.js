const Discord = require(`discord.js`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `showconfig`,
	description: `Show server settings`,
	options: null,
	run: async (client, interaction, LANG) => {

		client.chill.ensureGuildSettings(client, interaction.guild.id);

		const guildConf = client.settings.get(interaction.guild.id);

		// const locales = { da: `🇩🇰 Dansk`, de: `🇩🇪 Deutsch`, 'en-US': `🇺🇸 English`, 'es-ES': `🇪🇸 Español`, fr: `🇫🇷 Français`, hr: `🇭🇷 Hrvatski`, it: `🇮🇹 Italiano`, lt: `🇱🇹 Lietuviškai`, hu: `🇭🇺 Magyar`, nl: `🇳🇱 Nederlands`, no: `🇳🇴 Norsk`, pl: `🇵🇱 Polski`, 'pt-BR': `🇧🇷 Português do Brasil`, ro: `🇷🇴 Română`, fi: `🇫🇮 Suomi`, 'sv-SE': `🇸🇪 Svenska`, vi: `🇻🇳 Tiếng Việt`, tr: `🇹🇷 Türkçe`, cs: `🇨🇿 Čeština`, el: `🇬🇷 Ελληνικά`, bg: `🇧🇬 български`, ru: `🇷🇺 Pусский`, uk: `🇺🇦 Українська`, hi: `🇮🇳 हिन्दी`, th: `🇹🇭 ไทย`, 'zh-CN': `🇨🇳 中文`, ja: `🇯🇵 日本語`, 'zh-TW': `🇹🇼 繁體中文`, ko: `🇰🇷 한국어` };

		const locales = { da: { flag: `🇩🇰`, text: `Dansk` }, de: { flag: `🇩🇪`, text: `Deutsch` }, 'en-US': { flag: `🇺🇸`, text: `English` }, 'es-ES': { flag: `🇪🇸`, text: `Español` }, fr: { flag: `🇫🇷`, text: `Français` }, hr: { flag: `🇭🇷`, text: `Hrvatski` }, it: { flag: `🇮🇹`, text: `Italiano` }, lt: { flag: `🇱🇹`, text: `Lietuviškai` }, hu: { flag: `🇭🇺`, text: `Magyar` }, nl: { flag: `🇳🇱`, text: `Nederlands` }, no: { flag: `🇳🇴`, text: `Norsk` }, pl: { flag: `🇵🇱`, text: `Polski` }, 'pt-BR': { flag: `🇧🇷`, text: `Português do Brasil` }, ro: { flag: `🇷🇴`, text: `Română` }, fi: { flag: `🇫🇮`, text: `Suomi` }, 'sv-SE': { flag: `🇸🇪`, text: `Svenska` }, vi: { flag: `🇻🇳`, text: `Tiếng Việt` }, tr: { flag: `🇹🇷`, text: `Türkçe` }, cs: { flag: `🇨🇿`, text: `Čeština` }, el: { flag: `🇬🇷`, text: `Ελληνικά` }, bg: { flag: `🇧🇬`, text: `български` }, ru: { flag: `🇷🇺`, text: `Pусский` }, uk: { flag: `🇺🇦`, text: `Українська` }, hi: { flag: `🇮🇳`, text: `हिन्दी` }, th: { flag: `🇹🇭`, text: `ไทย` }, 'zh-CN': { flag: `🇨🇳`, text: `中文` }, ja: { flag: `🇯🇵`, text: `日本語` }, 'zh-TW': { flag: `🇹🇼`, text: `繁體中文` }, ko: { flag: `🇰🇷`, text: `한국어` } };

		function channel(toFind) {
			const text = interaction.guild.channels.cache.find(ch => ch.id === toFind) ? interaction.guild.channels.cache.get(toFind).name : LANG.not_found;
			return text;
		}
		function role(toFind) {
			const text = interaction.guild.roles.cache.find(r => r.id === toFind) ? interaction.guild.roles.cache.get(toFind).name : LANG.not_found;
			return text;
		}

		const channels = stripIndent`
		Join/Leave log  :: ${channel(guildConf.welcomechannel)}
		Announcements   :: ${channel(guildConf.bcchannel)}
		Punishments     :: ${channel(guildConf.puchannel)}
		Reports         :: ${channel(guildConf.reportchannel)}
		Giveaways       :: ${channel(guildConf.gachannel)}
		Polls           :: ${channel(guildConf.pollchannel)}
		Song-Request    :: ${channel(guildConf.musictextchannel)}
		Music Voice     :: ${channel(guildConf.musicvocalchannel)}
		Ticket Category :: ${channel(guildConf.ticketcategory)}
		`;
		const roles = stripIndent`
		Music Temp :: ${role(guildConf.musictemprole)}
		DJ         :: ${role(guildConf.djrole)}
		Staff      :: ${role(guildConf.supportrole)}
		Welcome    :: ${role(guildConf.roleonjoin)}
		`;
		const toggles = stripIndent`
		Music Text Only  :: ${guildConf.musicchannelonly}
		Auto-Delete cmds :: ${guildConf.autodeletecmds}
		XP               :: ${guildConf.xpmodule}
		Join/Leave msg   :: ${guildConf.welcomemessage}
		Welcome Role     :: ${guildConf.welcomerole}
		DJ required      :: ${guildConf.djrequired}
		`;
		const other = stripIndent`
		Prefix      :: ${guildConf.prefix}
		XP Cooldown :: ${guildConf.xpcooldown}
        `;

		const settingsEmbed = new Discord.EmbedBuilder()
			.setColor(`Blue`)
			.setTitle(LANG.title)
			.setDescription(`${locales[interaction.guild.preferredLocale || `en-US`].flag} \`${locales[interaction.guild.preferredLocale || `en-US`].text}\``)
			.addFields([
				{
					name: LANG.channels,
					value: `\`\`\`asciidoc\n${channels}\`\`\``,
					inline: false,
				},
				{
					name: LANG.roles,
					value: `\`\`\`asciidoc\n${roles}\`\`\``,
					inline: false,
				},
				{
					name: LANG.toggles,
					value: `\`\`\`asciidoc\n${toggles}\`\`\``,
					inline: true,
				},
				{
					name: LANG.other,
					value: `\`\`\`asciidoc\n${other}\`\`\``,
					inline: true,
				},
			]);

		if (channels.includes(LANG.not_found) || roles.includes(LANG.not_found)) {
			settingsEmbed.addFields([
				{
					name: LANG.warning_key,
					value: LANG.warning_value,
					inline: false,
				},
			]);
		}

		const dashboardLink = new Discord.ActionRowBuilder()
			.addComponents(
				new Discord.ButtonBuilder()
					.setLabel(LANG.dashboard)
					.setStyle(Discord.ButtonStyle.Link)
					.setURL(require(`../../config.json`).bot_dashboard_link)
					.setEmoji(`⚙️`),
			);

		interaction.reply({ embeds: [settingsEmbed], components: [dashboardLink] });
	},
};