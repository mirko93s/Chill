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
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true"
}

module.exports = {
    name: "resetconfig",
    aliases: ["defaultconfig"],
    category: "Settings",
	description: "Reset Guild's config to default values",
	usage: "resetconfig\n**e.g.**\n\`resetconfig\`\n> reset the server config values back to default",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
		if (client.settings.get(msg.guild.id, "autodeletecmds") === "true") msg.delete();

		const nopermEmbed = new Discord.MessageEmbed()
		.setColor(`RED`)
		.setTitle(`⛔ You don't have permission to use this!`)

		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));

        const resetEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
            .setDescription("Settings resetted to default values!")
            
        client.settings.set(msg.guild.id , defaultSettings);
        msg.channel.send(resetEmbed).then(msg => msg.delete({ timeout: 5000 }));
        

    }
}
