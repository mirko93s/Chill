const Discord = require(`discord.js`);

module.exports = {
	name: `cmd`,
	description: `Enable/disable a command globally`,
	dev: true,
	defaultPermission: false,
	options: [
		{
			name: `mode`,
			description: `Enable / Disable a command`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: `Enable`, value: `enable` },
				{ name: `Disable`, value: `disable` },
				{ name: `List Disabled`, value: `list` },
			],
		},
		{
			name: `command`,
			description: `command name`,
			type: Discord.ApplicationCommandOptionType.String,
		},
	],
	run: async (client, interaction, LANG) => {

		const mode = interaction.options.getString(`mode`);
		const command = interaction.options.getString(`command`);

		const noCmdEmbed = new Discord.EmbedBuilder()
			.setColor(`Red`)
			.setDescription(`⛔ No command found for \`${command}\``);
		if (!client.slashs.get(command) && mode !== `list`) return interaction.reply({ ephemeral: true, embeds: [noCmdEmbed] });

		if (mode === `disable`) {
			if (!client.cmdstats.includes(`disabled`, command)) {
				client.cmdstats.push(`disabled`, command);
				const disabledEmbed = new Discord.EmbedBuilder()
					.setColor(`Orange`)
					.setDescription(`✅ Successfully disabled command \`${command}\``);
				return interaction.reply({ ephemeral: true, embeds: [disabledEmbed] });
			} else {
				const alreadyDisabledEmbed = new Discord.EmbedBuilder()
					.setColor(`Red`)
					.setDescription(`⛔ \`${command}\` is already disabled`);
				return interaction.reply({ ephemeral: true, embeds: [alreadyDisabledEmbed] });
			}
		} else if (mode === `enable`) {
			if (client.cmdstats.includes(`disabled`, command)) {
				client.cmdstats.remove(`disabled`, command);
				const enabledEmbed = new Discord.EmbedBuilder()
					.setColor(`Green`)
					.setDescription(`✅ Successfully enabled command \`${command}\``);
				return interaction.reply({ ephemeral: true, embeds: [enabledEmbed] });
			} else {
				const alreadyEnabledEmbed = new Discord.EmbedBuilder()
					.setColor(`Red`)
					.setDescription(`⛔ \`${command}\` is already enabled`);
				return interaction.reply({ ephemeral: true, embeds: [alreadyEnabledEmbed] });
			}
		} else {
			let list = ``;
			client.cmdstats.get(`disabled`).forEach(cmd => {
				list += `\`${cmd}\` `;
			});
			if (list.length < 1) list = `**None**`;
			const listEmbed = new Discord.EmbedBuilder()
				.setColor(`Yellow`)
				.setTitle(`Disabled Commands`)
				.setDescription(list);
			return interaction.reply({ ephemeral: true, embeds: [listEmbed] });
		}
	},
};