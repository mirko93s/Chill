const Discord = require(`discord.js`);

module.exports = {
	name: `command`,
	description: `Enable/Disable a command on this server`,
	userPerms: [`ADMINISTRATOR`],
	options: [
		{
			name: `enable`,
			description: `Enable a command`,
			type: `SUB_COMMAND`,
			options: [
				{
					name: `command`,
					description: `Command to enable`,
					type: `STRING`,
					required: true,
				},
			],
		},
		{
			name: `disable`,
			description: `Disable a command`,
			type: `SUB_COMMAND`,
			options: [
				{
					name: `command`,
					description: `Command to disable`,
					type: `STRING`,
					required: true,
				},
			],
		},
		{
			name: `listdisabled`,
			description: `List all disabled commands`,
			type: `SUB_COMMAND`,
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
					const enabledEmbed = new Discord.MessageEmbed()
						.setColor(`GREEN`)
						.setTitle(LANG.enabled(command.name));
					return interaction.reply({ embeds: [enabledEmbed] });
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_enabled(_command))] });
				}
			case `disable`:
				if (!command) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_valid_command(_command))] });
				if (!client.settings.includes(interaction.guild.id, command.name, `disabledcommands`)) {
					client.settings.push(interaction.guild.id, command.name, `disabledcommands`);
					const disabledEmbed = new Discord.MessageEmbed()
						.setColor(`RED`)
						.setTitle(LANG.disabled(command.name));
					return interaction.reply({ embeds: [disabledEmbed] });
				} else {
					return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already_disabled(_command))] });
				}
			case `listdisabled`:
				const disabledcommands = client.settings.get(interaction.guild.id, `disabledcommands`);
				if (disabledcommands.length <= 0) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_commands)] });
				const disabledEmbed = new Discord.MessageEmbed()
					.setColor(`RANDOM`)
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
