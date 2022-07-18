const Discord = require(`discord.js`);

module.exports = {
	name: `roleinfo`,
	description: `Returns role info`,
	options: [
		{
			name: `role`,
			description: `Role you want to get info about`,
			type: Discord.ApplicationCommandOptionType.Role,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const role = interaction.options.getRole(`role`);

		const embed = new Discord.EmbedBuilder()
			.setColor(role.hexColor)
			.setTitle(LANG.title)
			.setDescription(`${role} \`${role.id}\``)
			.addFields([
				{
					name: LANG.created_at,
					value: role.createdAt.toDateString(),
					inline: true,
				},
				{
					name: LANG.mentionable,
					value: role.mentionable ? `Yes` : `No`,
					inline: true,
				},
				{
					name: LANG.position,
					value: role.position.toString(),
					inline: true,
				},
				{
					name: LANG.category,
					value: role.hoist.toString(),
					inline: true,
				},
				{
					name: LANG.counter,
					value: role.members.size.toString(),
					inline: true,
				},
				{
					name: LANG.color,
					value: role.hexColor,
					inline: true,
				},
			]);

		if (role.permissions.bitfield !== 0n) {
			embed.addFields([
				{
					name: LANG.perms,
					value: `\`${role.permissions.toArray().join(`, `)}\``,
					inline: false,
				},
			]);
		}

		interaction.reply({ embeds: [embed] });
	},
};
