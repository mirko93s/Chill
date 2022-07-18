const Discord = require(`discord.js`);
/**
 * @param {Client} client
 * @param {Object} msg
 * @param {String} cmd
 * @returns {EmbedBuilder}
 */
module.exports = function(client, msg, cmd) {
	if (client.settings.has(msg.guild.id, `customcmd.${cmd}`)) {
		if (client.settings.get(msg.guild.id, `autodeletecmds`) === `true`) msg.delete();
		const customEmbed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setDescription(client.settings.get(msg.guild.id, `customcmd.${cmd}`));
		return msg.channel.send({ embeds: [customEmbed] });
	}
};