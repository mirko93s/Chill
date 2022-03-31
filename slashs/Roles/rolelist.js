const Discord = require(`discord.js`);

module.exports = {
	name: `rolelist`,
	description: `Returns a list of server roles`,
	options: null,
	run: async (client, interaction, LANG) => {

		const role = interaction.guild.roles.cache;
		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title(role.size))
			.setDescription(role.map((e) => e).join(`\n`));
		interaction.reply({ embeds: [embed] });
	},
};
