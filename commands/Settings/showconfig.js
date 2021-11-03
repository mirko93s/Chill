const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
	name: "showconfig",
    aliases: ["config","controlpanel","cp"],
    category: "Settings",
	description: "Show current guild's config",
	usage: "showconfig\n**e.g**\n\`showconfig\`\n> get server settings (prefix, roles, channels, etc...)",
    run: async (client, msg, arg) => {
		
		client.chill.ensureGuildSettings(client,msg.guild.id);

		let guildConf = client.settings.get(msg.guild.id);
		
		function channel(toFind) {
			var text = msg.guild.channels.cache.find(ch => ch.id === toFind) ? msg.guild.channels.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
			return text;
		}
		function role(toFind) {
			var text = msg.guild.roles.cache.find(r => r.id === toFind) ? msg.guild.roles.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
			return text;
		}
		
		const channels = stripIndent`
		welcome     :: ${channel(guildConf.welcomechannel)}
		broadcast   :: ${channel(guildConf.bcchannel)}
		punishments :: ${channel(guildConf.puchannel)}
		reports     :: ${channel(guildConf.reportchannel)}
		giveaway    :: ${channel(guildConf.gachannel)}
		poll        :: ${channel(guildConf.pollchannel)}
		musictext   :: ${channel(guildConf.musictextchannel)}
		musicvoice  :: ${channel(guildConf.musicvocalchannel)}
		ticket      :: ${channel(guildConf.ticketcategory)}
		`;		
		const roles = stripIndent`
		musictemp :: ${role(guildConf.musictemprole)}
		muted     :: ${role(guildConf.mutedrole)}
		dj        :: ${role(guildConf.djrole)}
		support   :: ${role(guildConf.supportrole)}
		onjoin    :: ${role(guildConf.roleonjoin)}
		`;		
		const toggles = stripIndent`
		musictextonly  :: ${guildConf.musicchannelonly}
		autodeletecmds :: ${guildConf.autodeletecmds}
		xp             :: ${guildConf.xpmodule}
		welcomemsg     :: ${guildConf.welcomemessage}
		welcomerole    :: ${guildConf.welcomerole}
		djrequired     :: ${guildConf.djrequired}
		`;
		const other = stripIndent`
		prefix     :: ${guildConf.prefix}
		xpcooldown :: ${guildConf.xpcooldown}
        `;
		
		const settingsEmbed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle("💾Guild Settings")
			.addField('> Channels', `\`\`\`asciidoc\n${channels}\`\`\``, false)
			.addField('> Roles', `\`\`\`asciidoc\n${roles}\`\`\``, false)
			.addField('> Toggles',`\`\`\`asciidoc\n${toggles}\`\`\``, true)
			.addField('> Other', `\`\`\`asciidoc\n${other}\`\`\``, true)
					
		if (channels.includes("❌❌❌ NOT FOUND ❌❌❌") || roles.includes("❌❌❌ NOT FOUND ❌❌❌")) settingsEmbed.addField('⚠️ ⚠️ ⚠️ WARNING ⚠️ ⚠️ ⚠️','One or more keys are missing in the settings and some features won\'t work, this probably happened because you deleted bot roles or channels\n**Do `.setup` to fix the missing keys, it will recreate missing roles and channels. \nOr use `.setconfig` to manually set the them.**',false);
		
		msg.channel.send({embeds:[settingsEmbed]}).then(msg =>setTimeout(() => msg.delete(), 60000));
    }
}