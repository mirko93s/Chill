const Discord = require(`discord.js`);

module.exports = {
	name: `usercounter`,
	description: `Create a User Counter channel to keep tracking how many people are in your server`,
	userPerms: [`Administrator`],
	botPerms: [`ViewChannel`, `ManageChannels`, `Connect`],
	options: [
		{
			name: `mode`,
			description: `Enable or disable User Counter channel`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: `Enable`, value: `enable` },
				{ name: `Disable`, value: `disable` },
			],
		},
	],
	run: async (client, interaction, LANG) => {

		const channel = interaction.guild.channels.cache.find(c => c.id === (client.settings.get(interaction.guild.id, `usercounter`)));

		switch (interaction.options.getString(`mode`)) {
			case `enable`:
				if (channel) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_enabled(channel))] });
				let memberCount = interaction.guild.members.cache.filter(member => !member.user.bot).size; // filtering bots
				memberCount = client.chill.fancyNumber(memberCount);
				interaction.guild.channels.create(LANG.channel_name(memberCount), {
					type: Discord.ChannelType.GuildVoice,
					permissionOverwrites: [
						{
							id: interaction.guild.members.me.id,
							allow: [`CONNECT`],
						},
						{
							id: interaction.guild.roles.everyone.id,
							deny: [`CONNECT`],
							allow: [`ViewChannel`],
						},
					],
				}).then(created => {
					client.settings.set(interaction.guild.id, created.id, `usercounter`);
					const enabledEmbed = new Discord.EmbedBuilder()
						.setColor(`Green`)
						.setTitle(LANG.title)
						.setDescription(LANG.enabled(created))
						.setFooter({ text: LANG.footer });
					return interaction.reply({ embeds: [enabledEmbed] });
				});
				break;
			case `disable`:
				client.settings.delete(interaction.guild.id, `usercounter`);
				if (channel) {
					channel.delete();
					const disabledEmbed = new Discord.EmbedBuilder()
						.setColor(`Red`)
						.setTitle(LANG.title)
						.setDescription(LANG.disabled);
					return interaction.reply({ embeds: [disabledEmbed] });
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_disabled)] });
				}
				break;
		}
	},
};
