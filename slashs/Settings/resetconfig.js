const Discord = require("discord.js");

module.exports = {
	name: "resetconfig",
	description: "Reset Guild's config to default values",
    userPerms: ['ADMINISTRATOR'],
	options: null,
    run: async (client, interaction, arg) => {
		
        const resetEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle("💾Guild Settings")
			.setDescription("Settings resetted to default values!")
		
        client.settings.update(interaction.guild.id , defaultSettings);
        interaction.reply({embeds:[resetEmbed]});
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
	djrequired: "true",
	autovocalchannels: [],
	autovocalcloned: [],
	disabledcommands: []
}