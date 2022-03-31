const Discord = require(`discord.js`);
/**
 * @param {String} description
 * @returns {MessageEmbed}
 */
module.exports = function(description) {
	return new Discord.MessageEmbed()
		.setColor(`RED`)
		.setDescription(`⛔ ` + description);
};