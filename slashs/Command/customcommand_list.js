const Discord = require(`discord.js`);

module.exports = {
	name: `customcommand_list`,
	description: `Get a list of all custom commands on this server`,
	options: [
		{
			name: `command`,
			description: `Custom command name to check`,
			type: `STRING`,
		},
	],
	run: async (client, interaction, LANG) => {

		const command = interaction.options.getString(`command`);
		let cmdmsg = ``;

		if (!command) {
			const cmds = client.settings.get(interaction.guild.id, `customcmd`);
			if (!cmds) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_custom_commands)] });
			for (const [key] of Object.entries(cmds)) {
				cmdmsg += (`\`${key}\` `);
			};
			if (cmdmsg.length <= 0) return interaction.reply({ ephemeral: true, embeds: [LANG.no_custom_commands] });
			const ccEmbed = new Discord.MessageEmbed()
				.setColor(`RANDOM`)
				.setTitle(LANG.title)
				.setDescription(cmdmsg);
			return interaction.reply({ embeds: [ccEmbed] });
		} else if (client.settings.has(interaction.guild.id, `customcmd.${command}`)) {
			cmdmsg = `\`\`\`asciidoc\n${command} :: ${client.settings.get(interaction.guild.id, `customcmd.${command}`)}\n\`\`\``;
			ccEmbed.setDescription(cmdmsg);
			return interaction.reply({ ephemeral: true, embeds: [ccEmbed] });
		} else {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.error(command))] });
		}
	},
};
