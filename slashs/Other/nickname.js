const Discord = require(`discord.js`);

module.exports = {
	name: `nickname`,
	description: `Change users's nicknames`,
	botPerms: [`MANAGE_NICKNAMES`],
	userPerms: [`MANAGE_NICKNAMES`],
	options: [
		{
			name: `user`,
			description: `User to chnage the nick to`,
			type: `USER`,
			required: true,
		},
		{
			name: `nick`,
			description: `New nickname, max 32 characters`,
			type: `STRING`,
			required: true,
		},

	],
	run: async (client, interaction, LANG) => {

		const user = interaction.options.getMember(`user`);
		if (!user) return interaction.reply({ ephemeral: true, embeds: [LANG.not_in_guild] });

		if (user.roles.highest.position > interaction.guild.me.roles.highest.position || user.id === interaction.guild.ownerId) {
			return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.hierarchy)] });
		}

		const newnickname = interaction.options.getString(`nick`).substring(0, 32);
		interaction.guild.members.cache.get(user.user.id).setNickname(newnickname);
		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.addField(LANG.success, LANG.new_nick(newnickname, user.user.username));

		return interaction.reply({ embeds: [embed] });
	},
};