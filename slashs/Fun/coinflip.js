const Discord = require(`discord.js`);

module.exports = {
	name: `coinflip`,
	description: `Flip a Coin`,
	options: null,
	run: async (client, interaction, LANG) => {

		const coin = LANG.coin;
		const flippingEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title)
			.setDescription(LANG.flipping);
		const flippedEmbed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(LANG.title)
			.setDescription(LANG.flipped(interaction.member, coin[Math.floor(Math.random() * coin.length)]));

		await interaction.reply({ embeds: [flippingEmbed] }).then(() => {
			setTimeout(() => {
				interaction.editReply({ embeds: [flippedEmbed] });
			}, 1e3);
		});
	},
};
