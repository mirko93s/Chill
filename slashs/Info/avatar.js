const Discord = require(`discord.js`);

module.exports = {
	name: `avatar`,
	description: `Display user's Avatar (also available right-clicking someone)`,
	options: [
		{
			name: `user`,
			description: `User to get the avatar of`,
			type: Discord.ApplicationCommandOptionType.User,
		},
	],
	run: async (client, interaction, LANG) => {
		getPfp(interaction, interaction.options.getMember(`user`) || interaction.member, LANG);
	},
};

module.exports.user = {
	name: `Avatar`,
	type: Discord.ApplicationCommandType.User,
	contextdescription: `Display user's Avatar`,
	run: async (client, interaction, LANG) => {
		getPfp(interaction, interaction.targetMember, LANG);
	},
};

async function getPfp(interaction, user, LANG) {
	const avatarEmbed = new Discord.EmbedBuilder()
		.setColor(`Random`)
		.setTitle(LANG.title(user.user.username))
		.setImage(user.displayAvatarURL({ size: 4096, dynamic: true }))
		.setURL(user.displayAvatarURL({ size: 4096, dynamic: true }));
	interaction.reply({ embeds: [avatarEmbed] });
}