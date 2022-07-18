const Discord = require(`discord.js`);
/**
 * @param {String} description
 * @returns {EmbedBuilder}
 */
module.exports = function(description) {
	return new Discord.EmbedBuilder()
		.setColor(`Red`)
		.setDescription(`⛔ ` + description);
};