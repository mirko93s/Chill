const Discord = require(`discord.js`);

module.exports = {
	name: `ping`,
	description: `Get the bot's ping`,
	options: null,
	run: async (client, interaction, LANG) => {

		const start = Date.now();
		const awaitEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.calculating);

		await interaction.reply({ embeds: [awaitEmbed] });
		const end = Date.now();

		const pingEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(`📶 ${end - start} ms`)
			.setDescription(`\`API: ${client.ws.ping} ms\``);

		interaction.editReply({ embeds: [pingEmbed] });
	},
};