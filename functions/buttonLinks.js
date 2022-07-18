const Discord = require(`discord.js`);
const config = require(`../config.json`);
/**
 * @param {Object} interaction
 * @param {EmbedBuilder} embed
 * @returns adds buttons to given embed
 */
module.exports = async function(interaction, embed) {
	const links = new Discord.ActionRowBuilder()
		.addComponents(
			new Discord.ButtonBuilder()
				.setLabel(`Dashboard`)
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(config.bot_dashboard_link)
				.setEmoji(`⚙️`),
			new Discord.ButtonBuilder()
				.setLabel(`Invite`)
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(config.bot_invite_link)
				.setEmoji(`😃`),
			new Discord.ButtonBuilder()
				.setLabel(`Vote`)
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(config.bot_vote_link)
				.setEmoji(`💜`),
			new Discord.ButtonBuilder()
				.setLabel(`Github`)
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(config.bot_project_link),
			// .setEmoji('🧬'),
			new Discord.ButtonBuilder()
				.setLabel(`Website`)
				.setStyle(Discord.ButtonStyle.Link)
				.setURL(config.bot_website_link),
			// .setEmoji('🔗'),
		);
	return interaction.reply({ embeds: [embed], components: [links] });
};