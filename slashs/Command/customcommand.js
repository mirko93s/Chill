const Discord = require(`discord.js`);

module.exports = {
	name: `customcommand`,
	description: `Creates a new custom command`,
	userPerms: [`Administrator`],
	botPerms: [`ViewChannel`, `SendMessages`, `EmbedLinks`],
	options: [
		{
			name: `create`,
			description: `Create a new custom command`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `command`,
					description: `Set custom command name`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: `response`,
					description: `Set custom command response`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: `delete`,
			description: `Delete an existing custom command`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `command`,
					description: `Command name to be deleted`,
					type: Discord.ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		if (interaction.options.getSubcommand() === `create`) {
			const command = interaction.options.getString(`command`);
			if (client.commands.has(command) || client.aliases.has(command)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_override)] });
			const response = interaction.options.getString(`response`);
			if (command.length > 32 || response.length > 512) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.bad_args)] });
			client.settings.ensure(interaction.guild.id, { customcmd: {} });
			client.settings.set(interaction.guild.id, response, `customcmd.${command}`);
			const ccEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setTitle(LANG.title)
				.setDescription(LANG.created(command, response));
			interaction.reply({ embeds: [ccEmbed] });
		} else if (interaction.options.getSubcommand() === `delete`) {
			const command = interaction.options.getString(`command`);
			if (!client.settings.has(interaction.guild.id, `customcmd.${command}`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(command))] });
			client.settings.delete(interaction.guild.id, `customcmd.${command}`);
			const deletedEmbed = new Discord.EmbedBuilder()
				.setColor(`Green`)
				.setTitle(LANG.title)
				.setDescription(LANG.deleted(command));
			interaction.reply({ embeds: [deletedEmbed] });
		}

	},
};
