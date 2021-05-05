const Discord = require("discord.js");

module.exports = {
	name: "resetconfig",
    aliases: ["defaultconfig"],
    category: "Settings",
	description: "Reset Guild's config to default values",
	usage: "resetconfig\n**e.g.**\n\`resetconfig\`\n> reset the server config values back to default, it only resets config keys in the **Other** paragraph",
    permission: "ADMINISTRATOR",
    run: async (client, msg, arg) => {
		
		const nopermEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ You don't have permission to use this!`)
		
		if (!msg.member.hasPermission("ADMINISTRATOR")) return msg.reply(nopermEmbed).then(msg => msg.delete({ timeout: 5000 }));
		
        const resetEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription("Settings resetted to default values!")
		
        client.settings.update(msg.guild.id , defaultSettings);
        msg.channel.send(resetEmbed).then(msg => msg.delete({ timeout: 5000 }));
    }
}

const defaultSettings = {
	prefix: ".",
	musicchannelonly: "false",
	xpcooldown: 5,
	autodeletecmds: "true",
	xpmodule: "true",
	welcomemessage: "true",
	welcomerole: "true",
	autovocalchannels: [],
	autovocalcloned: [],
	disabledcommands: []
}