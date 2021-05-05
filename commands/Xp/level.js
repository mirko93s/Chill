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

		if (client.settings.get(msg.guild.id, "xpmodule") === "false") return msg.channel.send(moduleDisabledEmbed).then(msg => msg.delete({timeout:5000}));
		
		client.settings.ensure(msg.guild.id, {level: 0, points: 0}, `xp.${msg.author.id}`);

		let points = client.settings.get(msg.guild.id, `xp.${msg.author.id}.points`);
		let level = client.settings.get(msg.guild.id, `xp.${msg.author.id}.level`);

		//xp needed for a certain level = l^2/k^2 = (level^2)/(0.3163^2)
		const xptolevelup = (Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`)) - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))) - (points - Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)));
		const levelprogress = Math.round((points-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`)))*100/(Math.round(math.evaluate(`((${level}+1)^2)/(0.3163^2)`))-Math.round(math.evaluate(`(${level}^2)/(0.3163^2)`))));
		const bar = "▬".repeat((Math.round(levelprogress/10))) + "🔘" + "▬".repeat(10-(Math.round(levelprogress/10)));				
		const levelembed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setAuthor(`${msg.author.username}`, msg.author.avatarURL())
			.addField(`Level`,`**${level}**`,true)
			.addField(`Experience`,`**${fancyNumber(points)}**`,true)
			.addField(`${bar} **${levelprogress}%**`,`*${xptolevelup} to level up*`,false)
		msg.channel.send(levelembed);
    }
}