const Discord = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
	name: `mcstat`,
	description: `Get Minecraft server banners`,
	options: [
		{
			name: `server`,
			description: `IP of the server`,
			type: Discord.ApplicationCommandOptionType.String,
			maxLength: 1024,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {

		const ip = interaction.options.getString(`server`);

		const embed = new Discord.EmbedBuilder()
			.setAuthor({ name: LANG.author, iconURL: `https://i.imgur.com/BupabSS.png` })
			.setTitle(`\`${ip.includes(`:`) && ip.split(`:`)[1] == 25565 ? ip.split(`:`)[0] : ip}\``)
			.setColor(`Random`)
			.setImage(`http://status.mclive.eu/Server/` + ip + `/banner.png`);

		interaction.reply({ embeds: [embed] });
	},
};