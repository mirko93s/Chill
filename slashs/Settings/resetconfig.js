const Discord = require(`discord.js`);

module.exports = {
	name: `resetconfig`,
	description: `Reset Guild's config to default values. (WARNING: This cannot be undone!)`,
	userPerms: [`ADMINISTRATOR`],
	options: null,
	run: async (client, interaction, LANG) => {

		const resetEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title)
			.setDescription(LANG.description);

		client.settings.update(interaction.guild.id, defaultSettings);
		interaction.reply({ embeds: [resetEmbed] });
	},
};

const defaultSettings = {
	prefix: `.`,
	musicchannelonly: `false`,
	xpcooldown: 5,
	lang: `en_US`,
	autodeletecmds: `true`,
	xpmodule: `true`,
	welcomemessage: `true`,
	welcomerole: `true`,
	djrequired: `true`,
	autovocalchannels: [],
	autovocalcloned: [],
	disabledcommands: [],
};