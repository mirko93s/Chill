const Discord = require(`discord.js`);

module.exports = {
	name: `roleinfo`,
	description: `Returns role info`,
	options: [
		{
			name: `role`,
			description: `Role you want to get info about`,
			type: `ROLE`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const role = interaction.options.getRole(`role`);

		const embed = new Discord.MessageEmbed()
			.setColor(role.hexColor)
			.setTitle(LANG.title)
			.setDescription(`${role} \`${role.id}\``)
			.addField(LANG.created_at, role.createdAt.toDateString(), true)
			.addField(LANG.mentionable, role.mentionable ? `Yes` : `No`, true)
			.addField(LANG.position, role.position.toString(), true)
			.addField(LANG.category, role.hoist.toString(), true)
			.addField(LANG.counter, role.members.size.toString(), true)
			.addField(LANG.color, role.hexColor, true)
			.addField(LANG.perms, `\`${role.permissions.toArray().join(`, `)}\``);
		interaction.reply({ embeds: [embed] });
	},
};
