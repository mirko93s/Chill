const Discord = require(`discord.js`);

module.exports = {
	name: `command`,
	description: `Enable/Disable a command on this server`,
	userPerms: [`Administrator`],
	options: [
		{
			name: `enable`,
			description: `Enable a command`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `command`,
					description: `Command to enable`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: `disable`,
			description: `Disable a command`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `command`,
					description: `Command to disable`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: `listdisabled`,
			description: `List all disabled commands`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: null,
		},
	],
	run: async (client, interaction, LANG) => {

		const _command = interaction.options.getString(`command`);
		const command = client.commands.get(_command) || client.aliases.get(_command) || client.slashs.get(_command);

		switch (interaction.options.getSubcommand()) {
			case `enable`:
				if (!command) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_valid_command(_command))] });
				if (client.settings.includes(interaction.guild.id, command.name, `disabledcommands`)) {
					client.settings.remove(interaction.guild.id, command.name, `disabledcommands`);
					const enabledEmbed = new Discord.EmbedBuilder()
						.setColor(`Green`)
						.setTitle(LANG.enabled(command.name));
					return interaction.reply({ embeds: [enabledEmbed] });
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_enabled(_command))] });
				}
			case `disable`:
				if (!command) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_valid_command(_command))] });
				if (!client.settings.includes(interaction.guild.id, command.name, `disabledcommands`)) {
					client.settings.push(interaction.guild.id, command.name, `disabledcommands`);
					const disabledEmbed = new Discord.EmbedBuilder()
						.setColor(`Red`)
						.setTitle(LANG.disabled(command.name));
					return interaction.reply({ embeds: [disabledEmbed] });
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_disabled(_command))] });
				}
			case `listdisabled`:
				const disabledcommands = client.settings.get(interaction.guild.id, `disabledcommands`);
				if (disabledcommands.length <= 0) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_commands)] });
				const disabledEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setTitle(LANG.disabled_commands);
				let disabledmsg = ``;
				disabledcommands.forEach(cmd => {
					disabledmsg += (`\`${cmd}\` `);
				});
				disabledEmbed.setDescription(disabledmsg);
				return interaction.reply({ embeds: [disabledEmbed] });
		}
	},
};
