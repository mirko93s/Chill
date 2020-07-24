const Discord = require("discord.js");

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
	musicchannelonly: "false"
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
		
		const settingsEmbed = new Discord.RichEmbed()
			.setColor('BLUE')
			.setTitle("💾Guild Settings")

		Object.keys(guildConf).map(prop => {
		//   return `${prop}  :  ${guildConf[prop]}\n`;
			return settingsEmbed.addField(`${prop}`,`\`${guildConf[prop]}\``, true)
		});
		// msg.channel.send(`The following are the server's current configuration:
		// \`\`\`${configProps}\`\`\``);
		
		msg.channel.send(settingsEmbed).then(msg => msg.delete(30000));
    }
}
