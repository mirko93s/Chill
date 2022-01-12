const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
	name: "showconfig",
	description: "Show server settings",
	options: null,
    run: async (client, interaction, arg) => {
		
		client.chill.ensureGuildSettings(client,interaction.guild.id);

		let guildConf = client.settings.get(interaction.guild.id);
		
		function channel(toFind) {
			var text = interaction.guild.channels.cache.find(ch => ch.id === toFind) ? interaction.guild.channels.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
			return text;
		}
		function role(toFind) {
			var text = interaction.guild.roles.cache.find(r => r.id === toFind) ? interaction.guild.roles.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
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
		
		const settingsEmbed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle("💾Guild Settings")
			.addField('> Channels', `\`\`\`asciidoc\n${channels}\`\`\``, false)
			.addField('> Roles', `\`\`\`asciidoc\n${roles}\`\`\``, false)
			.addField('> Toggles',`\`\`\`asciidoc\n${toggles}\`\`\``, true)
			.addField('> Other', `\`\`\`asciidoc\n${other}\`\`\``, true)
					
		if (channels.includes("❌❌❌ NOT FOUND ❌❌❌") || roles.includes("❌❌❌ NOT FOUND ❌❌❌")) settingsEmbed.addField('⚠️ ⚠️ ⚠️ WARNING ⚠️ ⚠️ ⚠️','One or more keys are missing in the settings and some features won\'t work, this probably happened because you deleted bot roles or channels\n**Do `/setup` to fix the missing keys, it will recreate missing roles and channels. \nOr use `/setconfig` to manually set the them.**',false);
		
		interaction.reply({embeds:[settingsEmbed]});
    }
}