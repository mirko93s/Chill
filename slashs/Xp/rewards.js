const Discord = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
	name: `rewards`,
	description: `Unlockable roles based on XP level`,
	botPerms: [`ManageRoles`],
	options: [
		{
			name: `list`,
			description: `List all roles awarded by leveling up`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: null,
		},
		{
			name: `set`,
			description: `Set a new reward`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `level`,
					description: `Select a channel`,
					type: Discord.ApplicationCommandOptionType.Integer,
					required: true,
					minValue: 1,
				},
				{
					name: `role`,
					description: `Choose the role to award`,
					type: Discord.ApplicationCommandOptionType.Role,
					required: true,
				},
			],
		},
		{
			name: `delete`,
			description: `Delete an existing reward`,
			type: Discord.ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: `role`,
					description: `Choose the role to delete`,
					type: Discord.ApplicationCommandOptionType.Role,
					required: true,
				},
			],
		},
	],
	run: async (client, interaction, LANG) => {

		if (client.settings.get(interaction.guild.id, `xpmodule`) === `false`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.disabled)] });

		client.settings.ensure(interaction.guild.id, { rewards: {} });
		// list
		if (interaction.options.getSubcommand() === `list`) {
			const rewards = client.settings.get(interaction.guild.id, `rewards`);
			const sorted = {};
			Object // sort object
				.keys(rewards).sort(function(a, b) {
					return rewards[a] - rewards[b];
				})
				.forEach(function(key) {
					sorted[key] = rewards[key];
				});

			const rewardsEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(`Level Rewards`);
			let rolelist = ``;
			for (const [key, value] of Object.entries(sorted)) {
				const checkrole = interaction.guild.roles.cache.find(r => r.id === key);
				if (!checkrole) client.settings.delete(interaction.guild.id, `sorted.${key}`);// check if role still exists otherwise delete it from the db
				else rolelist += (`Lv.${value} - ${checkrole}\n`);
			};
			if (Object.keys(rewards).length < 1) rewardsEmbed.setDescription(LANG.no_rewards);
			else rewardsEmbed.setDescription(rolelist);
			return interaction.reply({ embeds: [rewardsEmbed] });
		}
		// set
		if (interaction.options.getSubcommand() === `set`) { // create a new reward or change its level
			if (!interaction.member.permissions.has(`Administrator`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_perms)] });
			const level = interaction.options.getInteger(`level`);
			const role = interaction.options.getRole(`role`);
			// check rewards limit
			const rewards = client.settings.get(interaction.guild.id, `rewards`);
			if (Object.keys(rewards).length > config.rewards_limit - 1) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.rewards_limit)] });
			// set
			client.settings.set(interaction.guild.id, level, `rewards.${role.id}`);
			const setEmbed = new Discord.EmbedBuilder()
				.setColor(`Random`)
				.setTitle(LANG.title)
				.setDescription(LANG.set(role, level));
			return interaction.reply({ ephemeral: true, embeds: [setEmbed] });
		}
		// delete
		if (interaction.options.getSubcommand() === `delete`) { // delete a reward
			if (!interaction.member.permissions.has(`Administrator`)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.no_perms)] });
			const role = interaction.options.getRole(`role`);
			if (client.settings.has(interaction.guild.id, `rewards.${role.id}`)) {
				client.settings.delete(interaction.guild.id, `rewards.${role.id}`);
				const deletedEmbed = new Discord.EmbedBuilder()
					.setColor(`Random`)
					.setTitle(LANG.title)
					.setDescription(LANG.removed(role));
				return interaction.reply({ embeds: [deletedEmbed] });
			} else {
				return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.invalid_reward)] });
			}
		}
	},
};
