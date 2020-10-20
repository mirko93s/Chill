const Discord = require("discord.js");
const { stripIndent } = require('common-tags');

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
	xpcooldown: 5
}

module.exports = {
    name: "showconfig",
    aliases: ["config"],
    category: "Settings",
	description: "Show current guild's config",
	usage: "showconfig\n**e.g**\n\`showconfig\`\n> get server settings (prefix, roles, channels, etc...)",
    run: async (client, msg, arg) => {
		msg.delete();

		let guildConf = client.settings.ensure(msg.guild.id, defaultSettings);
		
		const channels = stripIndent`
		welcomechannel    :: ${guildConf.welcomechannel}
		bcchannel         :: ${guildConf.bcchannel}
		puchannel         :: ${guildConf.puchannel}
		reportchannel     :: ${guildConf.reportchannel}
		gachannel         :: ${guildConf.gachannel}
		pollchannel       :: ${guildConf.pollchannel}
		musictextchannel  :: ${guildConf.musictextchannel}
		musicvocalchannel :: ${guildConf.musicvocalchannel}
		`;
		
		const roles = stripIndent`
		musictemprole :: ${guildConf.musictemprole}
		mutedrole     :: ${guildConf.mutedrole}
		djrole        :: ${guildConf.djrole}
		supportrole   :: ${guildConf.supportrole}
		roleonjoin    :: ${guildConf.roleonjoin}
		`;
		
		const other = stripIndent`
		prefix           :: ${guildConf.prefix}
		ticketcategory   :: ${guildConf.ticketcategory}
		musicchannelonly :: ${guildConf.musicchannelonly}
		xpcooldown       :: ${guildConf.xpcooldown}
			
        `;

		const settingsEmbed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setTitle("💾Guild Settings")
			.addField('Channels', `\`\`\`asciidoc\n${channels}\`\`\``, false)
			.addField('Roles', `\`\`\`asciidoc\n${roles}\`\`\``, false)
			.addField('Other', `\`\`\`asciidoc\n${other}\`\`\``, false)

		// Object.keys(guildConf).map(prop => {
		// //   return `${prop}  :  ${guildConf[prop]}\n`;
		// 	return settingsEmbed.addField(`${prop}`,`\`${guildConf[prop]}\``, true)
		// });
		// msg.channel.send(`The following are the server's current configuration:
		// \`\`\`${configProps}\`\`\``);
		
		msg.channel.send(settingsEmbed).then(msg => msg.delete(30000));
    }
}
