const Discord = require(`discord.js`);

module.exports = {
	name: `autovocal_create`,
	description: `Create a new auto-vocal channel`,
	userPerms: [`ManageChannels`],
	botPerms: [`ViewChannel`, `ManageChannels`, `Connect`, `MoveMembers`],
	options: null,
	run: async (client, interaction, LANG) => {

		interaction.guild.channels.create(LANG.channel_name, { type: Discord.ChannelType.GuildVoice }).then(channel => {
			client.settings.ensure(interaction.guild.id, defaultSettings);
			client.settings.push(interaction.guild.id, channel.id, `autovocalchannels`);
			const doneEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
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