const Discord = require(`discord.js`);

module.exports = {
	name: `autovocal_create`,
	description: `Create a new auto-vocal channel`,
	userPerms: [`MANAGE_CHANNELS`],
	botPerms: [`VIEW_CHANNEL`, `MANAGE_CHANNELS`, `CONNECT`, `MOVE_MEMBERS`],
	options: null,
	run: async (client, interaction, LANG) => {

		interaction.guild.channels.create(LANG.channel_name, { type: `GUILD_VOICE` }).then(channel => {
			client.settings.ensure(interaction.guild.id, defaultSettings);
			client.settings.push(interaction.guild.id, channel.id, `autovocalchannels`);
			const doneEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setTitle(LANG.title)
				.setDescription(LANG.description(channel));
			interaction.reply({ embeds: [doneEmbed] });
		});

	},
};

const defaultSettings = {
	autovocalchannels: [],
	autovocalcloned: [],
};