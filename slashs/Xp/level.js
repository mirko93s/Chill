const Discord = require(`discord.js`);
const math = require(`mathjs`);

module.exports = {
	name: `level`,
	description: `Returns your XP points and level`,
	options: null,
	run: async (client, interaction, LANG) => {

		if (client.settings.get(interaction.guild.id, `xpmodule`) === `false`) return interaction.reply({ ephemeral: true, embeds: [client.chill.error(LANG.disabled)] });

		client.settings.ensure(interaction.guild.id, { level: 0, points: 0 }, `xp.${interaction.user.id}`);

		const points = client.settings.get(interaction.guild.id, `xp.${interaction.user.id}.points`);
		const level = client.settings.get(interaction.guild.id, `xp.${interaction.user.id}.level`);

		// xp needed for a certain level = l^2/k^2 = (level^2)/(0.3163^2)
		const xptolevelup = (Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`)) - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))) - (points - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)));
		const levelprogress = Math.round((points - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))) * 100 / (Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`)) - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))));
		const bar = `▬`.repeat((Math.round(levelprogress / 10))) + `🔘` + `▬`.repeat(10 - (Math.round(levelprogress / 10)));
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor({ name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
			.addField(LANG.level, `**${level}**`, true)
			.addField(LANG.experience, `**${client.chill.fancyNumber(points)}**`, true)
			.addField(LANG.rank, `**${await getRank(client, interaction, LANG)}**`, true)
			.addField(`${bar} **${levelprogress}%**`, LANG.to_next_level(xptolevelup), false);
		interaction.reply({ embeds: [levelembed] });
	},
};

async function getRank(client, interaction, LANG) {
	let i = 1 ;
	const users = client.settings.get(interaction.guild.id, `xp`); // get object
	let sorted = {};
	Object // sort object
		.keys(users).sort(function(a, b) {
			return users[b].points - users[a].points;
		})
		.forEach(function(key) {
			sorted[key] = users[key];
		});

	sorted = Object.keys(sorted).map((key) => [key, sorted[key]]);

	for (const [user, data] of sorted) {
		if (user === interaction.user.id) {
			return i;
		}
		i++;
	}
	return LANG.n_a;
}