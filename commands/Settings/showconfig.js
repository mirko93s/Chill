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
	xpcooldown: 5,
	autodeletecmds: "true"
}

module.exports = {
    name: "showconfig",
    aliases: ["config"],
    category: "Settings",
	description: "Show current guild's config",
	usage: "showconfig\n**e.g**\n\`showconfig\`\n> get server settings (prefix, roles, channels, etc...)",
    run: async (client, msg, arg) => {
		if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

		let guildConf = client.settings.ensure(msg.guild.id, defaultSettings);
		
		const channels = stripIndent`
		welcomechannel    :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "welcomechannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "welcomechannel")).name + " | " + guildConf.welcomechannel : "❌❌❌ NOT FOUND ❌❌❌"}
		bcchannel         :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "bcchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "bcchannel")).name + " | " + guildConf.bcchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		puchannel         :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "puchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "puchannel")).name + " | " + guildConf.puchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		reportchannel     :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "reportchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "reportchannel")).name + " | " + guildConf.reportchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		pollchannel       :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "pollchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "pollchannel")).name + " | " + guildConf.pollchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		musictextchannel  :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "musictextchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "musictextchannel")).name + " | " + guildConf.musictextchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		musicvocalchannel :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "musicvocalchannel")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "musicvocalchannel")).name + " | " + guildConf.musicvocalchannel : "❌❌❌ NOT FOUND ❌❌❌"}
		ticketcategory    :: ${msg.guild.channels.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "ticketcategory")) ? msg.guild.channels.cache.get(client.settings.get(msg.guild.id, "ticketcategory")).name + " | " + guildConf.ticketcategory : "❌❌❌ NOT FOUND ❌❌❌"}
		`;
		
		const roles = stripIndent`
		musictemprole :: ${msg.guild.roles.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "musictemprole")) ? msg.guild.roles.cache.get(client.settings.get(msg.guild.id, "musictemprole")).name + " | " + guildConf.musictemprole : "❌❌❌ NOT FOUND ❌❌❌"}
		mutedrole     :: ${msg.guild.roles.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "mutedrole")) ? msg.guild.roles.cache.get(client.settings.get(msg.guild.id, "mutedrole")).name + " | " + guildConf.mutedrole : "❌❌❌ NOT FOUND ❌❌❌"}
		djrole        :: ${msg.guild.roles.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "djrole")) ? msg.guild.roles.cache.get(client.settings.get(msg.guild.id, "djrole")).name + " | " + guildConf.djrole : "❌❌❌ NOT FOUND ❌❌❌"}
		supportrole   :: ${msg.guild.roles.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "supportrole")) ? msg.guild.roles.cache.get(client.settings.get(msg.guild.id, "supportrole")).name + " | " + guildConf.supportrole : "❌❌❌ NOT FOUND ❌❌❌"}
		roleonjoin    :: ${msg.guild.roles.cache.find(channel => channel.id === client.settings.get(msg.guild.id, "roleonjoin")) ? msg.guild.roles.cache.get(client.settings.get(msg.guild.id, "roleonjoin")).name + " | " + guildConf.roleonjoin : "❌❌❌ NOT FOUND ❌❌❌"}
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
    }
}
