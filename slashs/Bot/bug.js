const talkedRecently = new Set();
const Discord = require(`discord.js`);
const config = require(`../../config.json`);

module.exports = {
	name: `bug`,
	description: `Report bugs to the dev. Please provide a good explanation and if possibile the steps to reproduce it`,
	options: [
		{
			name: `bug`,
			description: `Please provide a good explanation of the bug and if you can the steps to reproduce it`,
			type: `STRING`,
			required: true,
		},
	],
	run: async (client, interaction, LANG) => {


		if (talkedRecently.has(interaction.user.id)) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.cooldown)] });
		const bug = interaction.options.getString(`bug`);
		if (bug.length < 50 || bug.length > 4096) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.too_short)] });

		const bugembed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
			.setTitle(`🪲 Bug Report`)
			.setDescription(bug)
			.setTimestamp();

		client.channels.cache.get(config.bugreport_channel).send({ embeds: [bugembed] }).then(sentEmbed => {
			sentEmbed.react(`✅`)
				.then (() => sentEmbed.react(`❔`))
				.then (() => sentEmbed.react(`❌`));
		});

		const thanksEmbed = new Discord.MessageEmbed()
			.setColor(`GREEN`)
			.setTitle(LANG.success);
		interaction.reply({ ephemeral: true, embeds: [thanksEmbed] });

		talkedRecently.add(interaction.user.id);
		setTimeout(() => {
			talkedRecently.delete(interaction.user.id);
		}, 30 * 60000);
	},
};
