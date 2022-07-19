const Discord = require(`discord.js`);

module.exports = {
	name: `nickname`,
	description: `Change users's nicknames`,
	botPerms: [`ManageNicknames`],
	userPerms: [`ManageNicknames`],
	options: [
		{
			name: `user`,
			description: `User to chnage the nick to`,
			type: Discord.ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: `nick`,
			description: `New nickname, max 32 characters`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 32,
			required: true,
		},

	],
	run: async (client, interaction, LANG) => {

		const user = interaction.options.getMember(`user`);
		if (!user) return interaction.reply({ ephemeral: true, embeds: [LANG.not_in_guild] });

		if (user.roles.highest.position > interaction.guild.members.me.roles.highest.position || user.id === interaction.guild.ownerId) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.hierarchy)] });
		}

		const newnickname = interaction.options.getString(`nick`);
		interaction.guild.members.cache.get(user.user.id).setNickname(newnickname);
		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.addFields([
				{
					name: LANG.success,
					value: LANG.new_nick(newnickname, user.user.username),
					inline: false,
				},
			]);

		return interaction.reply({ embeds: [embed] });
	},
};