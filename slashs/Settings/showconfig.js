const Discord = require(`discord.js`);
const { stripIndent } = require(`common-tags`);

module.exports = {
	name: `showconfig`,
	description: `Show server settings`,
	options: null,
	run: async (client, interaction, LANG) => {

		client.chill.ensureGuildSettings(client, interaction.guild.id);

		const guildConf = client.settings.get(interaction.guild.id);

		function channel(toFind) {
			const text = interaction.guild.channels.cache.find(ch => ch.id === toFind) ? interaction.guild.channels.cache.get(toFind).name : client.lang(interaction.guild, `showconfig.not_found`);
			return text;
		}
		function role(toFind) {
			const text = interaction.guild.roles.cache.find(r => r.id === toFind) ? interaction.guild.roles.cache.get(toFind).name : client.lang(interaction.guild, `showconfig.not_found`);
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
		Language    :: ${guildConf.lang} ${langs[guildConf.lang]}
        `;

		const settingsEmbed = new Discord.MessageEmbed()
			.setColor(`BLUE`)
			.setTitle(LANG.title)
			.addField(LANG.channels, `\`\`\`asciidoc\n${channels}\`\`\``, false)
			.addField(LANG.roles, `\`\`\`asciidoc\n${roles}\`\`\``, false)
			.addField(LANG.toggles, `\`\`\`asciidoc\n${toggles}\`\`\``, true)
			.addField(LANG.other, `\`\`\`asciidoc\n${other}\`\`\``, true);

		if (channels.includes(LANG.not_found) || roles.includes(LANG.not_found)) settingsEmbed.addField(LANG.warning_key, LANG.warning_value, false);

		const dashboardLink = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageButton()
					.setLabel(LANG.dashboard)
					.setStyle(`LINK`)
					.setURL(require(`../../config.json`).bot_dashboard_link)
					.setEmoji(`⚙️`),
			);

		interaction.reply({ embeds: [settingsEmbed], components: [dashboardLink] });
	},
};