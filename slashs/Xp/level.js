const Discord = require("discord.js");
const math = require('mathjs');

module.exports = {
    name: "level",
    description: "Returns your XP points and level",
	options: null,
    run: async (client, interaction, arg) => {

		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)

		if (client.settings.get(interaction.guild.id, "xpmodule") === "false") return interaction.reply({ephemeral:true, embeds:[moduleDisabledEmbed]});
		
		client.settings.ensure(interaction.guild.id, {level: 0, points: 0}, `xp.${interaction.user.id}`);

		const points = client.settings.get(interaction.guild.id, `xp.${interaction.user.id}.points`);
		const level = client.settings.get(interaction.guild.id, `xp.${interaction.user.id}.level`);

		//xp needed for a certain level = l^2/k^2 = (level^2)/(0.3163^2)
		const xptolevelup = (Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`)) - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))) - (points - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)));
		const levelprogress = Math.round((points-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)))*100/(Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`))-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))));
		const bar = "▬".repeat((Math.round(levelprogress/10))) + "🔘" + "▬".repeat(10-(Math.round(levelprogress/10)));				
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor({name: `${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
			.addField(`Level`,`**${level}**`,true)
			.addField(`Experience`,`**${client.chill.fancyNumber(points)}**`,true)
			.addField('Rank',`**${await getRank(client, interaction)}**`,true)
			.addField(`${bar} **${levelprogress}%**`,`*${xptolevelup} to level up*`,false)
		interaction.reply({embeds:[levelembed]});
    }
}

async function getRank(client, interaction) {
	var i = 1 ;
	var users = client.settings.get(interaction.guild.id,"xp"); //get object
	var sorted = {};  
	Object //sort object
		.keys(users).sort(function(a, b){
			return users[b].points - users[a].points;
		})
		.forEach(function(key) {
			sorted[key] = users[key];
		});

	sorted = Object.keys(sorted).map((key) => [key, sorted[key]]);

	for (const [user,data] of sorted) {
		if(user===interaction.user.id) {
			return i;
		}
		i++;
	}
	return 'N/A';
}