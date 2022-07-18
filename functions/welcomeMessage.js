const Discord = require(`discord.js`);
/**
 * @param {Object} member
 * @param {Object} guild
 * @param {Boolean} join
 * @returns {EmbedBuilder}
 */
module.exports = function(client, member, guild, join = true) {
	const LANG = client.lang(guild.preferredLocale, `functions`, `welcomeMessage`);
	let count = guild.memberCount.toString();
	if (count.endsWith(`11`) || count.endsWith(`12`) || count.endsWith(`13`)) count += `th`;
	else if (count.endsWith(`1`)) count += `st`;
	else if (count.endsWith(`2`)) count += `nd`;
	else if (count.endsWith(`3`)) count += `rd`;
	else count += `th`;
	const message = LANG.messages(member, guild, count);
	const welcomeEmbed = new Discord.EmbedBuilder()
		.setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() });
	if (join === true) welcomeEmbed.setColor(`Green`).setDescription(message[Math.floor(Math.random() * message.length)]);
	else if (join === false) welcomeEmbed.setColor(`Red`).setDescription(LANG.left(member.user));

	return welcomeEmbed;
};