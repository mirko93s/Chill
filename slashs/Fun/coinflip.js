const Discord = require('discord.js');

module.exports = {
	name: 'coinflip',
	description: 'Flip a Coin',
	options: null,
	run: async (client, interaction, arg) => {

		const coin = ['Heads', 'Tails'];
		const flippingEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Coin Flip')
			.setDescription('Flipping . . .');
		const flippedEmbed = new Discord.MessageEmbed()
			.setColor('RANDOM')
			.setTitle('Coin Flip')
			.setDescription(interaction.user.username + ' flipped **' + (coin[Math.floor(Math.random() * coin.length)]) + '**');

		await interaction.reply({embeds:[flippingEmbed]}).then(() => {
			setTimeout(() => {
				interaction.editReply({embeds:[flippedEmbed]});
			}, 1e3);
		});
	},
};
