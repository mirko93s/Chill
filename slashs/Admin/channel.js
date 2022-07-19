const Discord = require(`discord.js`);

module.exports = {
	name: `channel`,
	description: `Create or Delete a channel`,
	userPerms: [`ManageChannels`],
	botPerms: [`ManageChannels`],
	options: [
		{
			name: `create`,
			description: `Create a new channel`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `name`,
					description: `New channel name`,
					type: Discord.ApplicationCommandOptionType.String,
					maxLength: 100,
					required: true,
				},
				{
					name: `type`,
					description: `Select a channel type`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{ name: `Text`, value: `GuildText` }, // 0
						{ name: `Voice`, value: `GuildVoice` }, // 2
						{ name: `Stage Voice`, value: `GuildStageVoice` }, // 13
						{ name: `Category`, value: `GuildCategory` }, // 4
						{ name: `News`, value: `GuildNews` }, // 5
					],
				},
			],
		},
		{
			name: `delete`,
			description: `Delete a channel. Careful with this, you can't get back your channel.`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `channel`,
					description: `Channel to delete`,
					type: Discord.ApplicationCommandOptionType.Channel,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getSubcommand() === `create`) {

			const channeltype = interaction.options.getString(`type`);
			const channelname = interaction.options.getString(`name`);

			interaction.guild.channels.create({ name: channelname, type: Discord.ChannelType[channeltype] }).then(channel => {
				const createdEmbed = new Discord.EmbedBuilder()
					.setColor(`Green`)
					.setDescription(LANG.created(channeltype, channel));
				interaction.reply({ embeds: [createdEmbed] });
			});
		} else {
			const channel = interaction.options.getChannel(`channel`);
			channel.delete();
			const deletedEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setDescription(LANG.deleted(channel.name));
			interaction.reply({ embeds: [deletedEmbed] });
		}
	},
};
