const Discord = require(`discord.js`);

module.exports = {
	name: `usercounter`,
	description: `Create a User Counter channel to keep tracking how many people are in your server`,
	userPerms: [`ADMINISTRATOR`],
	botPerms: [`VIEW_CHANNEL`, `MANAGE_CHANNELS`, `CONNECT`],
	options: [
		{
			name: `mode`,
			description: `Enable or disable User Counter channel`,
			type: `STRING`,
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
					type: `GUILD_VOICE`,
					permissionOverwrites: [
						{
							id: interaction.guild.me.id,
							allow: [`CONNECT`],
						},
						{
							id: interaction.guild.roles.everyone.id,
							deny: [`CONNECT`],
							allow: [`VIEW_CHANNEL`],
						},
					],
				}).then(created => {
					client.settings.set(interaction.guild.id, created.id, `usercounter`);
					const enabledEmbed = new Discord.MessageEmbed()
						.setColor(`GREEN`)
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
					const disabledEmbed = new Discord.MessageEmbed()
						.setColor(`RED`)
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
