const Discord = require("discord.js");
const { fancyNumber } = require("../../functions.js");
const math = require('mathjs');

module.exports = {
    name: "level",
    aliases: ["rank"],
    category: "Xp",
    description: "Returns your XP points and level",
    usage: "level\n**e.g.**\n\`level\`\n> Get your XP points and Level",
    run: async (client, msg, arg) => {

		const moduleDisabledEmbed = new Discord.MessageEmbed()
			.setColor(`RED`)
			.setTitle(`⛔ This module is disabled on this server!`)

		if (client.settings.get(msg.guild.id, "xpmodule") === "false") return msg.channel.send({embeds:[moduleDisabledEmbed]}).then(msg =>setTimeout(() => msg.delete(), 5000));
		
		client.settings.ensure(msg.guild.id, {level: 0, points: 0}, `xp.${msg.author.id}`);

		const points = client.settings.get(msg.guild.id, `xp.${msg.author.id}.points`);
		const level = client.settings.get(msg.guild.id, `xp.${msg.author.id}.level`);

		//xp needed for a certain level = l^2/k^2 = (level^2)/(0.3163^2)
		const xptolevelup = (Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`)) - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))) - (points - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)));
		const levelprogress = Math.round((points-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)))*100/(Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`))-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))));
		const bar = "▬".repeat((Math.round(levelprogress/10))) + "🔘" + "▬".repeat(10-(Math.round(levelprogress/10)));				
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(`${msg.author.username}`, msg.author.avatarURL())
			.addField(`Level`,`**${level}**`,true)
			.addField(`Experience`,`**${fancyNumber(points)}**`,true)
			.addField('Rank',`**${await getRank(client, msg)}**`,true)
			.addField(`${bar} **${levelprogress}%**`,`*${xptolevelup} to level up*`,false)
		msg.channel.send({embeds:[levelembed]});
    }
}

async function getRank(client, msg) {
	var i = 1 ;
	var users = client.settings.get(msg.guild.id,"xp"); //get object
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
		if(user===msg.author.id) {
			return i;
		}
		i++;
	}
	return 'N/A';
}