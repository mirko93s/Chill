const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

module.exports = {
	name: "showconfig",
    aliases: ["config"],
    category: "Settings",
	description: "Show current guild's config",
	usage: "showconfig\n**e.g**\n\`showconfig\`\n> get server settings (prefix, roles, channels, etc...)",
    run: async (client, msg, arg) => {
		
		let guildConf = client.settings.ensure(msg.guild.id, defaultSettings);
		
		function channel(toFind) {
			var text = msg.guild.channels.cache.find(ch => ch.id === toFind) ? toFind + " | " + msg.guild.channels.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
			return text;
		}
		function role(toFind) {
			var text = msg.guild.roles.cache.find(r => r.id === toFind) ? toFind + " | " + msg.guild.roles.cache.get(toFind).name : "❌❌❌ NOT FOUND ❌❌❌";
			return text;
		}
		
		const channels = stripIndent`
		welcomechannel    :: ${channel(guildConf.welcomechannel)}
		bcchannel         :: ${channel(guildConf.bcchannel)}
		puchannel         :: ${channel(guildConf.puchannel)}
		reportchannel     :: ${channel(guildConf.reportchannel)}
		pollchannel       :: ${channel(guildConf.pollchannel)}
		musictextchannel  :: ${channel(guildConf.musictextchannel)}
		musicvocalchannel :: ${channel(guildConf.musicvocalchannel)}
		ticketcategory    :: ${channel(guildConf.ticketcategory)}
		`;		
		const roles = stripIndent`
		musictemprole :: ${role(guildConf.musictemprole)}
		mutedrole     :: ${role(guildConf.mutedrole)}
		djrole        :: ${role(guildConf.djrole)}
		supportrole   :: ${role(guildConf.supportrole)}
		roleonjoin    :: ${role(guildConf.roleonjoin)}
		`;		
		const other = stripIndent`
		prefix           :: ${guildConf.prefix}
		xpcooldown       :: ${guildConf.xpcooldown}
		musicchannelonly :: ${guildConf.musicchannelonly}
		autodeletecmds   :: ${guildConf.autodeletecmds}
        `;
		
		const settingsEmbed = new Discord.MessageEmbed()
			.setColor('BLUE')
			.setTitle("💾Guild Settings")
			.addField('Channels', `\`\`\`asciidoc\n${channels}\`\`\``, false)
			.addField('Roles', `\`\`\`asciidoc\n${roles}\`\`\``, false)
			.addField('Other', `\`\`\`asciidoc\n${other}\`\`\``, false)
		
		msg.channel.send(settingsEmbed).then(msg => msg.delete({timeout:30000}));
		
		if (channels.includes("❌❌❌ NOT FOUND ❌❌❌") || roles.includes("❌❌❌ NOT FOUND ❌❌❌") || other.includes("❌❌❌ NOT FOUND ❌❌❌")){
			const missingkeysEmbed = new Discord.MessageEmbed()
				.setColor('RED')
				.setTitle('⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️')
				.setDescription('One or more keys are missing in the settings and some features won\'t work, this probably happened because you deleted bot roles or channels\n**Do `.setup` to fix the missing keys, it will recreate missing roles and channels.**')
			msg.channel.send(missingkeysEmbed).then(msg => msg.delete({timeout:30000}));
		}
    }
}

const defaultSettings = {
	prefix: ".",
	welcomechannel: "👋welcome",
	bcchannel: "🔴broadcast",
	puchannel: "🔨punishments",
	reportchannel: "🚨reports",
	gachannel: "🎉giveaway",
	pollchannel: "💡poll",
	musicvocalchannel: "🔊music",
	musictextchannel: "🎵song-request",
	musictemprole: "Listening",
	ticketcategory: "tickets",
	mutedrole: "Muted",
	djrole: "DJ",
	supportrole: "Support",
	roleonjoin: "Member",
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true"
}