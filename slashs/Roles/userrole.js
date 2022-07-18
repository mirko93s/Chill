const Discord = require(`discord.js`);

module.exports = {
	name: `userrole`,
	description: `Give or take a role to/from someone`,
	userPerms: [`ManageRoles`],
	botPerms: [`ManageRoles`],
	options: [
		{
			name: `mode`,
			description: `Select a mode`,
			type: Discord.ApplicationCommandOptionType.String,
			required: true,
			choices: [
				{ name: `give`, value: `give` },
				{ name: `take`, value: `take` },
			],
		},
		{
			name: `user`,
			description: `User to edit the roles to`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: `role`,
			description: `Select a role`,
			type: Discord.ApplicationCommandOptionType.Role,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const mode = interaction.options.getString(`mode`);
		const user = interaction.options.getMember(`user`);
		const role = interaction.options.getRole(`role`);
		const checkrole = user.roles.cache.some(r => r === role);

		if (interaction.guild.members.me.roles.highest.position < role.rawPosition) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.hierarch(role))] });

		if (mode === `give`) {
			if (checkrole) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.already(user))] });
			else await user.roles.add(role);
		} else if (!checkrole) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.not_yet(user))] });
		} else {
			await user.roles.remove(role);
		}

		const doneEmbed = new Discord.EmbedBuilder()
			.setColor(`Green`)
			.setDescription(mode === `give` ? LANG.role_given(role, user) : LANG.role_taken(role, user));
		return interaction.reply({ embeds: [doneEmbed] });
	},
};
